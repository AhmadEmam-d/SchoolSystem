// API/Controllers/MySubjectsController.cs
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Application.Features.Subjects.Queries.GetMySubjects;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SchoolSystem.API.Controllers
{
    [Route("api/my-subjects")]
    [ApiController]
    [Authorize]
    public class MySubjectsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IGenericRepository<Parent> _parentRepo;

        public MySubjectsController(
            IMediator mediator,
            IMessageService messageService,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Teacher> teacherRepo,
            IGenericRepository<Parent> parentRepo)
        {
            _mediator = mediator;
            _messageService = messageService;
            _studentRepo = studentRepo;
            _teacherRepo = teacherRepo;
            _parentRepo = parentRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetMySubjects()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userId = GetCurrentUserId();

                if (!userId.HasValue)
                    return Unauthorized();

                Guid? entityId = null;

                switch (userRole?.ToLower())
                {
                    case "student":
                        var student = await _studentRepo.GetAllQueryable()
                            .FirstOrDefaultAsync(s => s.UserId == userId.Value);
                        entityId = student?.Oid;
                        break;

                    case "teacher":
                        var teacher = await _teacherRepo.GetAllQueryable()
                            .FirstOrDefaultAsync(t => t.UserId == userId.Value);
                        entityId = teacher?.Oid;
                        break;

                    case "parent":
                        var parent = await _parentRepo.GetAllQueryable()
                            .FirstOrDefaultAsync(p => p.UserId == userId.Value);
                        entityId = parent?.Oid;
                        break;
                }

                if (!entityId.HasValue)
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "UserNotFound", _messageService,
                        new List<string> { $"No {userRole} record found." }  // Fixed: List<string>
                    ));

                var query = new GetMySubjectsQuery(entityId.Value, userRole!);
                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "MySubjectsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "MySubjectsFetchFailed", _messageService,
                    new List<string> { ex.Message }  // Fixed: List<string>
                ));
            }
        }

        [HttpGet("{subjectId:guid}")]
        public async Task<IActionResult> GetSubjectDetails(Guid subjectId)
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userId = GetCurrentUserId();

                if (!userId.HasValue)
                    return Unauthorized();

                Guid? entityId = null;

                switch (userRole?.ToLower())
                {
                    case "student":
                        var student = await _studentRepo.GetAllQueryable()
                            .FirstOrDefaultAsync(s => s.UserId == userId.Value);
                        entityId = student?.Oid;
                        break;

                    case "teacher":
                        var teacher = await _teacherRepo.GetAllQueryable()
                            .FirstOrDefaultAsync(t => t.UserId == userId.Value);
                        entityId = teacher?.Oid;
                        break;

                    case "parent":
                        var parent = await _parentRepo.GetAllQueryable()
                            .FirstOrDefaultAsync(p => p.UserId == userId.Value);
                        entityId = parent?.Oid;
                        break;
                }

                if (!entityId.HasValue)
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "UserNotFound", _messageService,
                        new List<string> { $"No {userRole} record found." }  // Fixed: List<string>
                    ));

                var query = new GetMySubjectsQuery(entityId.Value, userRole!, subjectId);
                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "SubjectDetailsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SubjectDetailsFetchFailed", _messageService,
                    new List<string> { ex.Message }  // Fixed: List<string>
                ));
            }
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("UserId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
                return userId;
            return null;
        }
    }
}