using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Common
{
    public class RequestModel
    {
        public List<FilterCondition> Filters { get; set; } = new();
        public SortModel Sort { get; set; } = new();
        public PaginationModel Pagination { get; set; } = new();
        public List<string> Columns { get; set; } = new();
    }
    public class FilterCondition
    {
        public string? PropertyName { get; set; }
        public object? Value { get; set; }
        public FilterOperation? Operation { get; set; }
    }
    public class SortModel
    {
        public string? SortBy { get; set; }
        public string? SortDirection { get; set; } // "asc" or "desc"
    }
    public class PaginationModel
    {
        public bool GetAll { get; set; } = false;
        public int? PageNumber { get; set; } = 1;
        public int? PageSize { get; set; } = 10;
    }


}
