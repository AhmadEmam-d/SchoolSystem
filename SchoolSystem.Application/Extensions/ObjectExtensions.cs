using SchoolSystem.Application.Common;
using System;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ValueCloudRestaurants.Application.Extensions
{
    public static class ObjectExtensions
    {
        public static IDictionary<string, object?> WithoutNulls(this object obj)
        {
            if (obj == null)
                return new Dictionary<string, object?>();

            return obj.GetType()
                .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Select(p => new { p.Name, Value = p.GetValue(obj) })
                .Where(x => x.Value != null)
                .ToDictionary(x => x.Name, x => x.Value);
        }
    }
    public static class QueryableExtensions
    {
        public static IQueryable<T> ApplyFilters<T>(this IQueryable<T> query, List<FilterCondition> filters)
        {
            if (filters == null || !filters.Any()) return query;

            foreach (var filter in filters)
            {
                if (string.IsNullOrWhiteSpace(filter.PropertyName) || filter.Value == null)
                    continue;

                var property = filter.PropertyName;
                var value = filter.Value;
                if (property.Equals("oid", StringComparison.OrdinalIgnoreCase) ||
                    property.Equals("id", StringComparison.OrdinalIgnoreCase))
                {
                    if (Guid.TryParse(value.ToString(), out Guid guidValue))
                    {
                        value = guidValue;
                    }
                }
                string expression;

                switch (filter.Operation)
                {
                    case FilterOperation.Equals:
                        expression = $"{property} == @0";
                        break;
                    case FilterOperation.NotEquals:
                        expression = $"{property} != @0";
                        break;
                    case FilterOperation.Contains:
                        expression = $"{property}.Contains(@0)";
                        break;
                    case FilterOperation.StartsWith:
                        expression = $"{property}.StartsWith(@0)";
                        break;
                    case FilterOperation.EndsWith:
                        expression = $"{property}.EndsWith(@0)";
                        break;
                    case FilterOperation.GreaterThan:
                        expression = $"{property} > @0";
                        break;
                    case FilterOperation.LessThan:
                        expression = $"{property} < @0";
                        break;
                    case FilterOperation.GreaterThanOrEqual:
                        expression = $"{property} >= @0";
                        break;
                    case FilterOperation.LessThanOrEqual:
                        expression = $"{property} <= @0";
                        break;
                    default:
                        continue;
                }

                try
                {
                    // Important: Convert value to string for string operations
                    if (filter.Operation == FilterOperation.Contains ||
                        filter.Operation == FilterOperation.StartsWith ||
                        filter.Operation == FilterOperation.EndsWith)
                    {
                        value = value.ToString();
                    }

                    query = query.Where(expression, value);
                }
                catch (Exception ex)
                {
                    throw new Exception($"Error applying filter on property '{property}' with value '{value}': {ex.Message}", ex);
                }
            }

            return query;
        }
        public static IQueryable<T> ApplySorting<T>(this IQueryable<T> query, SortModel? sort)
        {
            if (sort == null || string.IsNullOrWhiteSpace(sort.SortBy))
            {
                return query;
            }

            var direction = sort.SortDirection?.ToLower() == "desc" ? "descending" : "ascending";
            var ordering = $"{sort.SortBy} {direction}";

            try
            {
                query = query.OrderBy(ordering);
            }
            catch
            {
                return query;
            }

            return query;
        }



        public static IQueryable<T> ApplyPagination<T>(this IQueryable<T> query, PaginationModel? pagination)
        {
            if (pagination == null || pagination.GetAll)
                return query;

            int pageNumber = pagination.PageNumber ?? 1;
            int pageSize = pagination.PageSize ?? 10;

            int skip = (pageNumber - 1) * pageSize;
            return query.Skip(skip).Take(pageSize);
        }


        public static IQueryable SelectColumns<T>(this IQueryable<T> query, List<string>? columns)
        {
            if (columns == null || !columns.Any())
                return query.Select("new(it)");

            var safeColumns = columns
                .Where(c => !string.IsNullOrWhiteSpace(c))
                .Select(c =>
                {
                    var parts = c.Split(new[] { " as ", " AS " }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                    return parts.Length == 2
                        ? $"{parts[0]} as {parts[1]}"
                        : c.Trim();
                });

            var selector = "new(" + string.Join(", ", safeColumns) + ")";
            return query.Select(selector);
        }


    }
}

