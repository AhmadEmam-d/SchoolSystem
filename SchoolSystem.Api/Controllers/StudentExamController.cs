// API/Controllers/StudentExamController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Application.Features.Exams.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Security.Claims;

namespace SchoolSystem.API.Controllers
{
    [Route("api/student/exams")]
    [ApiController]
    [Authorize(Roles = "Student")]
    public class StudentExamController : ControllerBase
    {
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IGenericRepository<ExamSubmission> _submissionRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IFileService _fileService;
        private readonly IMessageService _messageService;

        public StudentExamController(
            IGenericRepository<Exam> examRepo,
            IGenericRepository<ExamSubmission> submissionRepo,
            IGenericRepository<Student> studentRepo,
            IFileService fileService,
            IMessageService messageService)
        {
            _examRepo = examRepo;
            _submissionRepo = submissionRepo;
            _studentRepo = studentRepo;
            _fileService = fileService;
            _messageService = messageService;
        }

        // GET: api/student/exams — list all exams for student's class
        [HttpGet]
        public async Task<IActionResult> GetMyExams()
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null) return Unauthorized();

                var exams = await _examRepo.GetAllQueryable()
                    .Include(e => e.Subject)
                    .Include(e => e.Teacher).ThenInclude(t => t!.User)
                    .Include(e => e.Materials)
                    .Include(e => e.Submissions.Where(s => s.StudentOid == student.Oid))
                    .Where(e => e.ClassOid == student.ClassOid && !e.IsDeleted)
                    .OrderByDescending(e => e.Date)
                    .ToListAsync();

                var result = exams.Select(e =>
                {
                    var submission = e.Submissions.FirstOrDefault();
                    return new StudentExamDto
                    {
                        ExamId = e.Oid,
                        Name = e.Name,
                        Description = e.Description,
                        Type = e.Type.ToString(),
                        SubjectName = e.Subject?.Name ?? "",
                        TeacherName = e.Teacher?.User?.FullName ?? "",
                        Instructions = e.Instructions,
                        Date = e.Date,
                        StartTime = e.StartTime.ToString(@"hh\:mm"),
                        Duration = e.Duration.ToString(@"hh\:mm"),
                        MaxScore = e.MaxScore,
                        PassingScore = e.PassingScore,
                        Status = e.Status.ToString(),
                        Room = e.Room,
                        Materials = e.Materials.Select(m => new ExamMaterialDto
                        {
                            Name = m.Name,
                            FileUrl = m.FileUrl,
                            FileType = m.FileType,
                            FileSize = m.FileSize
                        }).ToList(),
                        MySubmission = submission == null ? null : new StudentExamSubmissionDto
                        {
                            SubmissionId = submission.Oid,
                            AnswerText = submission.AnswerText,
                            AttachmentUrl = submission.AttachmentUrl,
                            FileName = submission.FileName,
                            SubmittedAt = submission.SubmittedAt??DateTime.UtcNow,
                            Score = submission.Score,
                            Feedback = submission.Feedback,
                            Status = submission.Status.ToString()??string.Empty,
                            GradedAt = submission.GradedAt
                        }
                    };
                }).ToList();

                return Ok(ApiResponseFactory.Success(result, "ExamsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>("FetchFailed", _messageService, new List<string> { ex.Message }));
            }
        }

        // GET: api/student/exams/{examId} — single exam details
        [HttpGet("{examId:guid}")]
        public async Task<IActionResult> GetExamDetails(Guid examId)
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null) return Unauthorized();

                var exam = await _examRepo.GetAllQueryable()
                    .Include(e => e.Subject)
                    .Include(e => e.Teacher).ThenInclude(t => t!.User)
                    .Include(e => e.Materials)
                    .Include(e => e.Submissions.Where(s => s.StudentOid == student.Oid))
                    .FirstOrDefaultAsync(e => e.Oid == examId && e.ClassOid == student.ClassOid && !e.IsDeleted);

                if (exam == null)
                    return NotFound(ApiResponseFactory.Failure<object>("ExamNotFound", _messageService, null));

                var submission = exam.Submissions.FirstOrDefault();

                var result = new StudentExamDto
                {
                    ExamId = exam.Oid,
                    Name = exam.Name,
                    Description = exam.Description,
                    Type = exam.Type.ToString(),
                    SubjectName = exam.Subject?.Name ?? "",
                    TeacherName = exam.Teacher?.User?.FullName ?? "",
                    Instructions = exam.Instructions,
                    Date = exam.Date,
                    StartTime = exam.StartTime.ToString(@"hh\:mm"),
                    Duration = exam.Duration.ToString(@"hh\:mm"),
                    MaxScore = exam.MaxScore,
                    PassingScore = exam.PassingScore,
                    Status = exam.Status.ToString(),
                    Room = exam.Room,
                    Materials = exam.Materials.Select(m => new ExamMaterialDto
                    {
                        Name = m.Name,
                        FileUrl = m.FileUrl,
                        FileType = m.FileType,
                        FileSize = m.FileSize
                    }).ToList(),
                    MySubmission = submission == null ? null : new StudentExamSubmissionDto
                    {
                        SubmissionId = submission.Oid,
                        AnswerText = submission.AnswerText,
                        AttachmentUrl = submission.AttachmentUrl,
                        FileName = submission.FileName,
                        SubmittedAt = submission.SubmittedAt??DateTime.UtcNow,
                        Score = submission.Score,
                        Feedback = submission.Feedback,
                        Status = submission.Status.ToString()??string.Empty,
                        GradedAt = submission.GradedAt
                    }
                };

                return Ok(ApiResponseFactory.Success(result, "ExamFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>("FetchFailed", _messageService, new List<string> { ex.Message }));
            }
        }

        // POST: api/student/exams/{examId}/upload-solution
        [HttpPost("{examId:guid}/upload-solution")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadSolution(Guid examId, IFormFile file)
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null) return Unauthorized();

                if (file == null || file.Length == 0)
                    return BadRequest(ApiResponseFactory.Failure<object>("NoFileProvided", _messageService, new List<string> { "File is required." }));

                if (!_fileService.IsValidFile(file, out var errorMessage))
                    return BadRequest(ApiResponseFactory.Failure<object>("InvalidFile", _messageService, new List<string> { errorMessage }));

                var uploadResult = await _fileService.UploadFileAsync(file, "exam-solutions", examId);

                return Ok(ApiResponseFactory.Success(new UploadExamAttachmentResponseDto
                {
                    AttachmentUrl = uploadResult.FileUrl,
                    FileName = file.FileName
                }, "FileUploadedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>("UploadFailed", _messageService, new List<string> { ex.Message }));
            }
        }

        // POST: api/student/exams/{examId}/submit
        [HttpPost("{examId:guid}/submit")]
        public async Task<IActionResult> SubmitExam(Guid examId, [FromBody] SubmitExamDto dto)
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null) return Unauthorized();

                // Check exam exists and belongs to student's class
                var exam = await _examRepo.GetAllQueryable()
                    .FirstOrDefaultAsync(e => e.Oid == examId && e.ClassOid == student.ClassOid && !e.IsDeleted);

                if (exam == null)
                    return NotFound(ApiResponseFactory.Failure<object>("ExamNotFound", _messageService, null));

                // Check already submitted
                var existing = await _submissionRepo.GetAllQueryable()
                    .FirstOrDefaultAsync(s => s.ExamOid == examId && s.StudentOid == student.Oid);

                if (existing != null)
                    return BadRequest(ApiResponseFactory.Failure<object>("AlreadySubmitted", _messageService,
                        new List<string> { "You have already submitted this exam." }));

                var isLate = DateTime.UtcNow > exam.Date.Add(exam.StartTime).Add(exam.Duration);

                var submission = new ExamSubmission
                {
                    Oid = Guid.NewGuid(),
                    ExamOid = examId,
                    StudentOid = student.Oid,
                    AnswerText = dto.AnswerText,
                    AttachmentUrl = dto.AttachmentUrl,
                    FileName = dto.FileName,
                    SubmittedAt = DateTime.UtcNow,
                    Status = isLate ? ExamSubmissionStatus.Late : ExamSubmissionStatus.Submitted,
                    CreatedAt = DateTime.UtcNow
                };

                await _submissionRepo.AddAsync(submission);

                return Ok(ApiResponseFactory.Success(new
                {
                    submissionId = submission.Oid,
                    submission.SubmittedAt,
                    Status = submission.Status.ToString(),
                    IsLate = isLate
                }, "ExamSubmittedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>("SubmitFailed", _messageService, new List<string> { ex.Message }));
            }
        }

        private async Task<Student?> GetCurrentStudent()
        {
            var userIdClaim = User.FindFirst("UserId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return null;

            return await _studentRepo.GetAllQueryable()
                .FirstOrDefaultAsync(s => s.UserId == userId);
        }
    }
}