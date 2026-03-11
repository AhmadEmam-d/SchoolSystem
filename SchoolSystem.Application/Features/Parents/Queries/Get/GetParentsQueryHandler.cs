using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Common;
using SchoolSystem.Application.Features.Parents.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ValueCloudRestaurants.Application.Extensions;

namespace SchoolSystem.Application.Features.Parents.Queries.Get
{
    public class GetParentsQueryHandler : IRequestHandler<GetParentsQuery, QueryResponse<object>>
    {
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly IMapper _mapper;

        public GetParentsQueryHandler(IGenericRepository<Parent> parentRepo, IMapper mapper)
        {
            _parentRepo = parentRepo;
            _mapper = mapper;
        }

        public async Task<QueryResponse<object>> Handle(GetParentsQuery request, CancellationToken ct)
        {
            var res = new QueryResponse<object>();
            var m = request.Request ?? new RequestModel();

            try
            {
                // Base query with includes (if Parent has related entities like Students)
                var baseQuery = _parentRepo.GetAllQueryable()
                                            .Include(p => p.Students)
                                            .AsNoTracking();

                // Apply filters
                if (m.Filters != null && m.Filters.Any())
                {
                    baseQuery = baseQuery.ApplyFilters(m.Filters);
                }

                // Apply sorting
                if (m.Sort != null && !string.IsNullOrWhiteSpace(m.Sort.SortBy))
                {
                    baseQuery = baseQuery.ApplySorting(m.Sort);
                }

                // Get total count before pagination
                var totalItems = await baseQuery.CountAsync(ct);

                // Handle pagination
                var getAll = m.Pagination?.GetAll == true;
                var pageNumber = getAll ? 1 : Math.Max(m.Pagination?.PageNumber ?? 1, 1);
                var pageSize = getAll ? totalItems : Math.Max(m.Pagination?.PageSize ?? 10, 1);

                // Apply pagination
                var pagedQuery = baseQuery;
                if (!getAll && pageSize > 0)
                {
                    var skip = (pageNumber - 1) * pageSize;
                    pagedQuery = baseQuery.Skip(skip).Take(pageSize);
                }

                // Execute query
                var paged = await pagedQuery.ToListAsync(ct);

                // Map to DTO (you'll need to create ParentResponseDto)
                var items = _mapper.Map<List<ParentDto>>(paged).Cast<object>().ToList();

                // Build response
                res.Data = items;
                res.TotalItems = totalItems;
                res.TotalPages = getAll
                    ? (totalItems > 0 ? 1 : 0)
                    : (pageSize > 0 ? (int)Math.Ceiling(totalItems / (double)pageSize) : (totalItems > 0 ? 1 : 0));
                res.Success = true;

                return res;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in GetParentsQueryHandler: {ex.Message}", ex);
            }
        }
    }
}