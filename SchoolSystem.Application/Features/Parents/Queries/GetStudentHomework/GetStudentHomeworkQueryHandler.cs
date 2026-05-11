// Application/Features/Parents/Queries/GetChildrenHomework/GetChildrenHomeworkQueryHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Parents.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Parents.Queries.GetStudentHomework
{
    public class GetStudentHomeworkQueryHandler : IRequestHandler<GetStudentHomeworkQuery, List<StudentHomeworkDto>>
    {
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IGenericRepository<Homework> _homeworkRepo;

        public GetStudentHomeworkQueryHandler(
            IGenericRepository<Parent> parentRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IGenericRepository<Homework> homeworkRepo)
        {
            _parentRepo = parentRepo;
            _studentRepo = studentRepo;
            _submissionRepo = submissionRepo;
            _homeworkRepo = homeworkRepo;
        }

        public async Task<List<StudentHomeworkDto>> Handle(GetStudentHomeworkQuery request, CancellationToken cancellationToken)
        {
            var parent = await _parentRepo.GetAllQueryable()
                .FirstOrDefaultAsync(p => p.UserId == request.ParentUserId, cancellationToken);

            if (parent == null)
                throw new Exception("Parent not found");

            var students = await _studentRepo.GetAllQueryable()
                .Where(s => s.ParentOid == parent.Oid)
                .ToListAsync(cancellationToken);

            var studentIds = students.Select(s => s.Oid).ToList();

            var submissions = await _submissionRepo.GetAllQueryable()
                .Include(s => s.Homework)
                    .ThenInclude(h => h.Subject)
                .Include(s => s.Student)
                .Where(s => studentIds.Contains(s.StudentOid))
                .ToListAsync(cancellationToken);

            var distinctSubmissions = submissions
                .GroupBy(s => new { s.StudentOid, s.HomeworkOid })
                .Select(g => g.First())
                .ToList();

            var result = new List<StudentHomeworkDto>();

            foreach (var submission in distinctSubmissions)
            {
                var status = DetermineSubmissionStatus(submission);

                var dueDate = submission.Homework?.DueDate ?? DateTime.Now;

                result.Add(new StudentHomeworkDto
                {
                    StudentOid = submission.StudentOid,
                    StudentName = submission.Student?.FullName ?? "Unknown",
                    SubjectName = submission.Homework?.Subject?.Name ?? "Unknown",
                    Title = submission.Homework?.Title ?? "Untitled",
                    DueDate = dueDate,
                    Status = status,
                    Grade = submission.Grade,
                    TotalMarks = submission.Homework?.TotalMarks ?? 0
                });
            }

            result = result.OrderBy(r => r.DueDate).ToList();

            return result;
        }

        private string DetermineSubmissionStatus(HomeworkSubmission submission)
        {
            if (submission.Grade.HasValue)
                return "Graded";

          
            if (submission.SubmittedAt != DateTime.MinValue)
                return "Submitted";

            if (submission.Homework != null && submission.Homework.DueDate < DateTime.Now)
                return "Overdue";

            return "Pending";
        }
    }
}