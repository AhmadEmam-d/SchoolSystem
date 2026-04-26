// Application/Features/Subjects/Queries/GetMySubjects/GetMySubjectsQueryHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Subjects.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Subjects.Queries.GetMySubjects
{
    public class GetMySubjectsQueryHandler : IRequestHandler<GetMySubjectsQuery, List<MySubjectDto>>
    {
        private readonly IGenericRepository<Subject> _subjectRepo;
        private readonly IGenericRepository<Lesson> _lessonRepo;
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly IGenericRepository<TeacherSubject> _teacherSubjectRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;

        public GetMySubjectsQueryHandler(
            IGenericRepository<Subject> subjectRepo,
            IGenericRepository<Lesson> lessonRepo,
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<Exam> examRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Teacher> teacherRepo,
            IGenericRepository<Parent> parentRepo,
            IGenericRepository<TeacherSubject> teacherSubjectRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IGenericRepository<ExamResult> examResultRepo)
        {
            _subjectRepo = subjectRepo;
            _lessonRepo = lessonRepo;
            _homeworkRepo = homeworkRepo;
            _examRepo = examRepo;
            _studentRepo = studentRepo;
            _teacherRepo = teacherRepo;
            _parentRepo = parentRepo;
            _teacherSubjectRepo = teacherSubjectRepo;
            _submissionRepo = submissionRepo;
            _examResultRepo = examResultRepo;
        }

        public async Task<List<MySubjectDto>> Handle(GetMySubjectsQuery request, CancellationToken cancellationToken)
        {
            switch (request.Role.ToLower())
            {
                case "student":
                    return await GetStudentSubjects(request.EntityId, request.SubjectId, cancellationToken);
                case "teacher":
                    return await GetTeacherSubjects(request.EntityId, request.SubjectId, cancellationToken);
                case "parent":
                    return await GetParentSubjects(request.EntityId, request.SubjectId, cancellationToken);
                default:
                    return new List<MySubjectDto>();
            }
        }

        private async Task<List<MySubjectDto>> GetStudentSubjects(Guid studentId, Guid? subjectId, CancellationToken cancellationToken)
        {
            var student = await _studentRepo.GetByOidAsync(studentId);
            if (student == null) return new List<MySubjectDto>();

            // Get subjects from lessons for student's class
            var subjectIds = await _lessonRepo.GetAllQueryable()
                .Where(l => !l.IsDeleted && l.ClassOid == student.ClassOid)
                .Select(l => l.SubjectOid)
                .Distinct()
                .ToListAsync(cancellationToken);

            if (subjectId.HasValue)
                subjectIds = subjectIds.Where(id => id == subjectId.Value).ToList();

            var subjects = await _subjectRepo.GetAllQueryable()
                .Where(s => subjectIds.Contains(s.Oid) && !s.IsDeleted)
                .ToListAsync(cancellationToken);

            var result = new List<MySubjectDto>();

            foreach (var subject in subjects)
            {
                // Get lessons
                var lessons = await _lessonRepo.GetAllQueryable()
                    .Where(l => !l.IsDeleted && l.SubjectOid == subject.Oid && l.ClassOid == student.ClassOid)
                    .OrderBy(l => l.Date)
                    .ToListAsync(cancellationToken);

                // Get homeworks
                var homeworks = await _homeworkRepo.GetAllQueryable()
                    .Where(h => !h.IsDeleted && h.SubjectOid == subject.Oid && h.ClassOid == student.ClassOid)
                    .ToListAsync(cancellationToken);

                // Get exams
                var exams = await _examRepo.GetAllQueryable()
                    .Where(e => !e.IsDeleted && e.SubjectOid == subject.Oid && e.ClassOid == student.ClassOid)
                    .ToListAsync(cancellationToken);

                // Get submissions
                var submissions = await _submissionRepo.GetAllQueryable()
                    .Where(s => s.StudentOid == studentId && homeworks.Select(h => h.Oid).Contains(s.HomeworkOid))
                    .ToDictionaryAsync(s => s.HomeworkOid, cancellationToken);

                // Get exam results
                var examResults = await _examResultRepo.GetAllQueryable()
                    .Where(r => r.StudentOid == studentId && exams.Select(e => e.Oid).Contains(r.ExamOid))
                    .ToDictionaryAsync(r => r.ExamOid, cancellationToken);

                result.Add(new MySubjectDto
                {
                    SubjectId = subject.Oid,
                    SubjectName = subject.Name,
                    LessonsCount = lessons.Count,
                    HomeworksCount = homeworks.Count,
                    ExamsCount = exams.Count,
                    AverageGrade = examResults.Values.Any() ? examResults.Values.Average(r => r.Percentage ?? 0) : null,
                    Lessons = lessons.Select(l => new MyLessonDto
                    {
                        LessonId = l.Oid,
                        Title = l.Title,
                        Date = l.Date,
                        StartTime = l.StartTime,
                        EndTime = l.EndTime,
                        Status = GetLessonStatus(l.Date, l.StartTime),
                        MaterialsCount = l.Materials?.Count ?? 0
                    }).ToList(),
                    Homeworks = homeworks.Select(h => new MyHomeworkDto
                    {
                        HomeworkId = h.Oid,
                        Title = h.Title,
                        DueDate = h.DueDate,
                        TotalMarks = h.TotalMarks,
                        Status = GetHomeworkStatus(h, submissions.ContainsKey(h.Oid) ? submissions[h.Oid] : null),
                        MyGrade = submissions.ContainsKey(h.Oid) ? submissions[h.Oid].Grade : null,
                        Feedback = submissions.ContainsKey(h.Oid) ? submissions[h.Oid].Feedback : null
                    }).ToList(),
                    Exams = exams.Select(e => new MyExamDto
                    {
                        ExamId = e.Oid,
                        Name = e.Name,
                        Date = e.Date,
                        MaxScore = e.MaxScore,
                        Status = GetExamStatus(e.Date),
                        MyScore = examResults.ContainsKey(e.Oid) ? examResults[e.Oid].Score : null
                    }).ToList()
                });
            }

            return result;
        }

        private async Task<List<MySubjectDto>> GetTeacherSubjects(Guid teacherId, Guid? subjectId, CancellationToken cancellationToken)
        {
            // Get subjects assigned to this teacher
            var subjectIds = await _teacherSubjectRepo.GetAllQueryable()
                .Where(ts => ts.TeacherOid == teacherId)
                .Select(ts => ts.SubjectOid)
                .ToListAsync(cancellationToken);

            if (subjectId.HasValue)
                subjectIds = subjectIds.Where(id => id == subjectId.Value).ToList();

            var subjects = await _subjectRepo.GetAllQueryable()
                .Where(s => subjectIds.Contains(s.Oid) && !s.IsDeleted)
                .ToListAsync(cancellationToken);

            var result = new List<MySubjectDto>();

            foreach (var subject in subjects)
            {
                // Get students in classes where teacher teaches this subject
                var classIds = await _lessonRepo.GetAllQueryable()
                    .Where(l => !l.IsDeleted && l.SubjectOid == subject.Oid && l.TeacherOid == teacherId)
                    .Select(l => l.ClassOid)
                    .Distinct()
                    .ToListAsync(cancellationToken);

                var students = await _studentRepo.GetAllQueryable()
                    .Where(s => !s.IsDeleted && classIds.Contains(s.ClassOid))
                    .Include(s => s.User)
                    .ToListAsync(cancellationToken);

                result.Add(new MySubjectDto
                {
                    SubjectId = subject.Oid,
                    SubjectName = subject.Name,
                    Students = students.Select(s => new StudentInSubjectDto
                    {
                        StudentId = s.Oid,
                        StudentName = s.User?.FullName ?? s.FullName,
                        AverageGrade = null
                    }).ToList()
                });
            }

            return result;
        }

        private async Task<List<MySubjectDto>> GetParentSubjects(Guid parentId, Guid? subjectId, CancellationToken cancellationToken)
        {
            // Get all children for this parent
            var children = await _studentRepo.GetAllQueryable()
                .Where(s => s.ParentOid == parentId && !s.IsDeleted)
                .ToListAsync(cancellationToken);

            if (!children.Any()) return new List<MySubjectDto>();

            var classIds = children.Select(c => c.ClassOid).Distinct().ToList();

            // Get subjects from lessons for those classes
            var subjectIds = await _lessonRepo.GetAllQueryable()
                .Where(l => !l.IsDeleted && classIds.Contains(l.ClassOid))
                .Select(l => l.SubjectOid)
                .Distinct()
                .ToListAsync(cancellationToken);

            if (subjectId.HasValue)
                subjectIds = subjectIds.Where(id => id == subjectId.Value).ToList();

            var subjects = await _subjectRepo.GetAllQueryable()
                .Where(s => subjectIds.Contains(s.Oid) && !s.IsDeleted)
                .ToListAsync(cancellationToken);

            return subjects.Select(s => new MySubjectDto
            {
                SubjectId = s.Oid,
                SubjectName = s.Name
            }).ToList();
        }

        private string GetLessonStatus(DateTime date, DateTime startTime)
        {
            var now = DateTime.UtcNow;
            var lessonStart = date.Date + startTime.TimeOfDay;

            if (now < lessonStart)
                return "Upcoming";
            if (now > lessonStart.Add(TimeSpan.FromHours(1)))
                return "Completed";
            return "Ongoing";
        }

        private string GetHomeworkStatus(Homework homework, HomeworkSubmission? submission)
        {
            if (submission?.Grade.HasValue == true)
                return "Graded";
            if (submission != null)
                return "Submitted";
            if (homework.DueDate < DateTime.UtcNow)
                return "Overdue";
            return "Pending";
        }

        private string GetExamStatus(DateTime examDate)
        {
            if (examDate > DateTime.UtcNow.Date)
                return "Upcoming";
            if (examDate < DateTime.UtcNow.Date)
                return "Completed";
            return "Today";
        }
    }
}