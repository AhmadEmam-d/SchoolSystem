using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Attendance.Commands.Create;
using SchoolSystem.Application.Features.Attendance.Commands.Delete;
using SchoolSystem.Application.Features.Attendance.Commands.StartAttendanceSession;
using SchoolSystem.Application.Features.Attendance.Commands.StudentSubmitAttendance;
using SchoolSystem.Application.Features.Attendance.Commands.SubmitAttendanceSession;
using SchoolSystem.Application.Features.Attendance.Commands.Update;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Application.Features.Attendance.Queries.GetAll;
using SchoolSystem.Application.Features.Attendance.Queries.GetById;
using SchoolSystem.Application.Features.Attendance.Queries.GetClassStats;
using SchoolSystem.Application.Features.Attendance.Queries.GetMonthlyReport;
using SchoolSystem.Application.Features.Attendance.Queries.GetToday;
using SchoolSystem.Application.Features.Attendance.Queries.GetWeekly;
using SchoolSystem.Application.Features.Attendance.Quieries.GetActiveSession;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;
        private readonly IGenericRepository<AttendanceSession> _sessionRepo;
        private readonly IGenericRepository<Student> _studentRepo;                          // ✅ add
        private readonly IGenericRepository<Domain.Entities.Attendance> _attendanceRepo;

        public AttendanceController(IMediator mediator, IMessageService messageService, IGenericRepository<AttendanceSession> sessionRepo, IGenericRepository<Student> studentRepo, IGenericRepository<Domain.Entities.Attendance> attendanceRepo)
        {
            _mediator = mediator;
            _messageService = messageService;
            _sessionRepo = sessionRepo;
            _studentRepo = studentRepo;
            _attendanceRepo = attendanceRepo;
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetToday([FromQuery] Guid? classOid)
        {
            try
            {
                var result = await _mediator.Send(new GetTodayAttendanceQuery { ClassOid = classOid });
                return Ok(ApiResponseFactory.Success(result, "TodayAttendanceFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("weekly")]
        public async Task<IActionResult> GetWeekly([FromQuery] Guid? classOid, [FromQuery] DateTime? startDate)
        {
            try
            {
                var result = await _mediator.Send(new GetWeeklyAttendanceQuery { ClassOid = classOid, StartDate = startDate });
                return Ok(ApiResponseFactory.Success(result, "WeeklyAttendanceFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("monthly-report")]
        public async Task<IActionResult> GetMonthlyReport([FromQuery] int? year, [FromQuery] int? month, [FromQuery] Guid? classOid)
        {
            try
            {
                var result = await _mediator.Send(new GetMonthlyAttendanceReportQuery { Year = year, Month = month, ClassOid = classOid });
                return Ok(ApiResponseFactory.Success(result, "MonthlyReportFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ReportFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] Guid? classOid, [FromQuery] DateTime? date)
        {
            try
            {
                var result = await _mediator.Send(new GetAllAttendancesQuery { ClassOid = classOid, Date = date });
                return Ok(ApiResponseFactory.Success(result, "AttendancesFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendancesFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new GetAttendanceByIdQuery(oid));
                if (result == null)
                    return NotFound();

                return Ok(ApiResponseFactory.Success(result, "AttendanceFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Create([FromBody] CreateAttendanceDto dto)
        {
            try
            {
                var result = await _mediator.Send(new CreateAttendanceCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "AttendanceCreatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceCreationFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpPut("{oid}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateAttendanceDto dto)
        {
            try
            {
                if (oid != dto.Oid)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "IDMismatch", _messageService,
                        new List<string> { "ID mismatch between URL and body." }
                    ));
                }

                var result = await _mediator.Send(new UpdateAttendanceCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "AttendanceUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpDelete("{oid}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new DeleteAttendanceCommand(oid));
                return Ok(ApiResponseFactory.Success(result, "AttendanceDeletedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceDeletionFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
        [HttpGet("class-stats/{classOid:guid}")]
        public async Task<IActionResult> GetClassStats(Guid classOid)
        {
            try
            {
                var result = await _mediator.Send(new GetClassAttendanceStatsQuery { ClassOid = classOid });
                return Ok(ApiResponseFactory.Success(result, "ClassStatsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "StatsFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
        [HttpGet("sessions")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> GetAllSessions([FromQuery] Guid? classOid)
        {
            try
            {
                var sessions = _sessionRepo
                    .GetAllQueryable()
                    .Cast<AttendanceSession>()
                    .Where(s => !s.IsDeleted);

                if (classOid.HasValue)
                    sessions = sessions.Where(s => s.ClassOid == classOid.Value);

                var result = await sessions
                    .OrderByDescending(s => s.StartTime)
                    .Select(s => new
                    {
                        sessionId = s.Oid,
                        classOid = s.ClassOid,
                        method = ((AttendanceMethod)s.Method).ToString(),
                        startTime = s.StartTime,
                        expiresAt = s.ExpiresAt,
                        isCompleted = s.IsCompleted,
                        completedAt = s.CompletedAt,
                        isExpired = DateTime.UtcNow > s.ExpiresAt && !s.IsCompleted
                    })
                    .ToListAsync();

                return Ok(ApiResponseFactory.Success(new
                {
                    total = result.Count,
                    sessions = result
                }, "SessionsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SessionsFetchFailed", _messageService,
                    new List<string> { ex.Message }));
            }
        }
        [HttpGet("session/{sessionId:guid}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> GetSessionAttendance(Guid sessionId)
        {
            try
            {
                // 1. Load the session
                var session = await _sessionRepo.GetByOidAsync(sessionId);
                if (session == null)
                    return NotFound(ApiResponseFactory.Failure<object>(
                        "SessionNotFound", _messageService, null));

                // 2. Get all students in the class
                var students = await _studentRepo
                    .GetAllQueryable()
                    .Cast<Student>()
                    .Where(s => s.ClassOid == session.ClassOid && !s.IsDeleted)
                    .Select(s => new { s.Oid, s.User.FullName })
                    .ToListAsync();

                // 3. Get attendance records for this session's date and class
                var records = await _attendanceRepo
                        .GetAllQueryable()
                        .Cast<Domain.Entities.Attendance>()
                        .Where(a => a.SessionOid == sessionId && !a.IsDeleted)
                        .ToListAsync();

                // 4. Merge — every student gets a row whether they attended or not
                var result = students.Select(s =>
                {
                    var record = records.FirstOrDefault(r => r.StudentOid == s.Oid);
                    return new
                    {
                        studentOid = s.Oid,
                        studentName = s.FullName,
                        status = record != null ? record.Status.ToString() : "NotRecorded",
                        checkInTime = record?.CheckInTime?.ToString(@"hh\:mm"),
                        remarks = record?.Remarks
                    };
                }).ToList();

                return Ok(ApiResponseFactory.Success(new
                {
                    sessionId = session.Oid,
                    classOid = session.ClassOid,
                    date = session.StartTime.Date,
                    method = ((AttendanceMethod)session.Method).ToString(),
                    totalStudents = students.Count,
                    presentCount = result.Count(r => r.status == "Present"),
                    absentCount = result.Count(r => r.status == "Absent"),
                    lateCount = result.Count(r => r.status == "Late"),
                    notRecorded = result.Count(r => r.status == "NotRecorded"),
                    students = result
                }, "SessionAttendanceFetched", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SessionAttendanceFetchFailed", _messageService,
                    new List<string> { ex.Message }));
            }
        }
        // في AttendanceController.cs أضف:

        [HttpPost("start-session")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> StartAttendanceSession([FromBody] StartAttendanceSessionDto dto)
        {
            try
            {
                var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (teacherIdClaim == null || !Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                    return Unauthorized();

                var command = new StartAttendanceSessionCommand { Dto = dto, TeacherId = teacherId };
                var result = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(result, "SessionStartedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SessionStartFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpPost("submit-session")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> SubmitAttendanceSession([FromBody] SubmitAttendanceSessionDto dto)
        {
            try
            {
                var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (teacherIdClaim == null || !Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                    return Unauthorized();

                var command = new SubmitAttendanceSessionCommand { Dto = dto, TeacherId = teacherId };
                var result = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(result, "AttendanceSubmittedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceSubmitFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
        [HttpGet("active-session")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetActiveSession()
        {
            try
            {
                var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (studentIdClaim == null || !Guid.TryParse(studentIdClaim.Value, out var studentId))
                    return Unauthorized();

                var result = await _mediator.Send(new GetActiveSessionForStudentQuery { StudentId = studentId });
                return Ok(ApiResponseFactory.Success(result, "ActiveSessionFetched", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ActiveSessionFetchFailed", _messageService,
                    new List<string> { ex.Message }));
            }
        }
        [HttpPost("student-submit")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> StudentSubmit([FromBody] StudentSubmitAttendanceDto dto)
        {
            try
            {
                var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (studentIdClaim == null || !Guid.TryParse(studentIdClaim.Value, out var studentId))
                    return Unauthorized();

                var command = new StudentSubmitAttendanceCommand { Dto = dto, StudentId = studentId };
                var result = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(result, "AttendanceSubmittedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceSubmitFailed", _messageService,
                    new List<string> { ex.Message }));
            }
        }
        [HttpGet("qr-preview/{sessionId}")]
        [Authorize(Roles = "Teacher,Admin,Student")]
        public async Task<IActionResult> QrPreview(Guid sessionId)
        {
            var sessions = _sessionRepo
                .GetAllQueryable()
                .Cast<AttendanceSession>();

            AttendanceSession? session = null;
            await foreach (var s in sessions.AsAsyncEnumerable())
            {
                if (s.Oid == sessionId) { session = s; break; }
            }

            if (session == null || string.IsNullOrEmpty(session.QrCode))
                return NotFound("No QR code for this session.");

            var bytes = Convert.FromBase64String(session.QrCode);
            return File(bytes, "image/png");
        }
    }
}