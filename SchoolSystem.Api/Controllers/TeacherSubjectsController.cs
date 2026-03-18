using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherSubjectsController : ControllerBase
    {
        private readonly IGenericRepository<TeacherSubject> _teacherSubjectRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IGenericRepository<Subject> _subjectRepo;
        private readonly IMessageService _messageService;

        public TeacherSubjectsController(
            IGenericRepository<TeacherSubject> teacherSubjectRepo,
            IGenericRepository<Teacher> teacherRepo,
            IGenericRepository<Subject> subjectRepo,
            IMessageService messageService)
        {
            _teacherSubjectRepo = teacherSubjectRepo;
            _teacherRepo = teacherRepo;
            _subjectRepo = subjectRepo;
            _messageService = messageService;
        }


        [HttpPost("assign")]
        public async Task<IActionResult> AssignTeacherToSubject(Guid teacherOid, Guid subjectOid)
        {
            try
            {
                var teacher = await _teacherRepo.GetByOidAsync(teacherOid);
                if (teacher == null)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "TeacherNotFound", _messageService,
                        new List<string> { "Teacher not found" }
                    ));
                }

                var subject = await _subjectRepo.GetByOidAsync(subjectOid);
                if (subject == null)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "SubjectNotFound", _messageService,
                        new List<string> { "Subject not found" }
                    ));
                }

                var existingAssignment = await _teacherSubjectRepo
                    .GetAllQueryable()
                    .FirstOrDefaultAsync(ts => ts.TeacherOid == teacherOid && ts.SubjectOid == subjectOid);

                if (existingAssignment != null)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "AssignmentExists", _messageService,
                        new List<string> { "Teacher already assigned to this subject" }
                    ));
                }

                var teacherSubject = new TeacherSubject
                {
                    TeacherOid = teacherOid,
                    SubjectOid = subjectOid
                };

                await _teacherSubjectRepo.AddAsync(teacherSubject);

                return Ok(ApiResponseFactory.Success(true, "TeacherAssignedToSubjectSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AssignmentFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetAllAssignments()
        {
            try
            {
                var assignments = await _teacherSubjectRepo
                    .GetAllQueryable()
                    .Include(ts => ts.Teacher)
                    .Include(ts => ts.Subject)
                    .Select(ts => new
                    {
                        ts.Oid,
                        TeacherName = ts.Teacher.FullName,
                        SubjectName = ts.Subject.Name
                    })
                    .ToListAsync();

                return Ok(ApiResponseFactory.Success(assignments, "AssignmentsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AssignmentsFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("by-teacher/{teacherOid}")]
        public async Task<IActionResult> GetSubjectsByTeacher(Guid teacherOid)
        {
            try
            {
                var subjects = await _teacherSubjectRepo
                    .GetAllQueryable()
                    .Include(ts => ts.Subject)
                    .Where(ts => ts.TeacherOid == teacherOid)
                    .Select(ts => new
                    {
                        ts.Subject.Oid,
                        ts.Subject.Name,
                    })
                    .ToListAsync();

                return Ok(ApiResponseFactory.Success(subjects, "SubjectsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SubjectsFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }


        [HttpGet("by-subject/{subjectOid}")]
        public async Task<IActionResult> GetTeachersBySubject(Guid subjectOid)
        {
            try
            {
                var teachers = await _teacherSubjectRepo
                    .GetAllQueryable()
                    .Include(ts => ts.Teacher)
                    .Where(ts => ts.SubjectOid == subjectOid)
                    .Select(ts => new
                    {
                        ts.Teacher.Oid,
                        ts.Teacher.FullName,
                        ts.Teacher.Email
                    })
                    .ToListAsync();

                return Ok(ApiResponseFactory.Success(teachers, "TeachersFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TeachersFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveTeacherFromSubject(Guid teacherOid, Guid subjectOid)
        {
            try
            {
                var assignment = await _teacherSubjectRepo
                    .GetAllQueryable()
                    .FirstOrDefaultAsync(ts => ts.TeacherOid == teacherOid && ts.SubjectOid == subjectOid);

                if (assignment == null)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "AssignmentNotFound", _messageService,
                        new List<string> { "Assignment not found" }
                    ));
                }

                await _teacherSubjectRepo.DeleteAsync(assignment.Oid);

                return Ok(ApiResponseFactory.Success(true, "TeacherRemovedFromSubjectSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "RemovalFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}