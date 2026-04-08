using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Common;
using SchoolSystem.Application.Features.Sections.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using SchoolSystem.Application.Extensions;

namespace SchoolSystem.Application.Features.Sections.Queries.Get
{
    public class GetSectionsQueryHandler : IRequestHandler<GetSectionsQuery, QueryResponse<object>>
    {
        private readonly IGenericRepository<Section> _sectionRepo;
        private readonly IMapper _mapper;

        public GetSectionsQueryHandler(IGenericRepository<Section> sectionRepo, IMapper mapper)
        {
            _sectionRepo = sectionRepo;
            _mapper = mapper;
        }

        public async Task<QueryResponse<object>> Handle(GetSectionsQuery request, CancellationToken ct)
        {
            var res = new QueryResponse<object>();
            var m = request.Request ?? new RequestModel();

            try
            {
                // Base query with includes
                var baseQuery = _sectionRepo.GetAllQueryable()
                                            .Include(s => s.Class)      // تحميل الـ Class المرتبط
                                            .Include(s => s.Students)   // تحميل الطلاب
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

                // Map to DTO
                var items = _mapper.Map<List<SectionDto>>(paged).Cast<object>().ToList();

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
                throw new Exception($"Error in GetSectionsQueryHandler: {ex.Message}", ex);
            }
        }
    }
}