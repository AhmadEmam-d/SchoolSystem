// Application/Features/Lessons/Queries/Get/GetLessonsQueryHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Common;
using SchoolSystem.Application.Features.Lessons.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using SchoolSystem.Application.Extensions;

namespace SchoolSystem.Application.Features.Lessons.Queries.Get
{
    public class GetLessonsQueryHandler : IRequestHandler<GetLessonsQuery, QueryResponse<object>>
    {
        private readonly IGenericRepository<Lesson> _lessonRepo;
        private readonly IMapper _mapper;

        public GetLessonsQueryHandler(IGenericRepository<Lesson> lessonRepo, IMapper mapper)
        {
            _lessonRepo = lessonRepo;
            _mapper = mapper;
        }

        public async Task<QueryResponse<object>> Handle(GetLessonsQuery request, CancellationToken ct)
        {
            var res = new QueryResponse<object>();
            var m = request.Request ?? new RequestModel();

            try
            {
                // Base query with includes
                var baseQuery = _lessonRepo.GetAllQueryable()
                                            .Include(l => l.Class)
                                            .Include(l => l.Subject)
                                            .Include(l => l.Teacher)
                                            .Include(l => l.Teacher.User)
                                            .Include(l => l.Objectives)
                                            .Include(l => l.Materials)
                                            .Include(l => l.Homeworks)
                                            .Where(l => !l.IsDeleted)
                                            .AsNoTracking();

                // Apply filters (using FilterCondition list)
                if (m.Filters != null && m.Filters.Any())
                {
                    try
                    {
                        baseQuery = baseQuery.ApplyFilters(m.Filters);
                    }
                    catch (Exception ex)
                    {
                        throw new Exception($"Filter error: {ex.Message}", ex);
                    }
                }

                // Apply sorting
                if (m.Sort != null && !string.IsNullOrWhiteSpace(m.Sort.SortBy))
                {
                    try
                    {
                        baseQuery = baseQuery.ApplySorting(m.Sort);
                    }
                    catch (Exception ex)
                    {
                        throw new Exception($"Sorting error: {ex.Message}", ex);
                    }
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
                var items = _mapper.Map<List<LessonResponseDto>>(paged).Cast<object>().ToList();

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
                throw new Exception($"Error in GetLessonsQueryHandler: {ex.Message}", ex);
            }
        }
    }
}