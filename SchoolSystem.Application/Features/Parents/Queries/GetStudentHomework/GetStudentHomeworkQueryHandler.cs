using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Parents.Queries.GetStudentHomework
{
    public class GetStudentHomeworkQueryHandler : IRequestHandler<GetStudentHomeworkQuery, List<StudentHomeworkDto>>
    {
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IGenericRepository<Subject> _subjectRepo;

        public GetStudentHomeworkQueryHandler(
            IGenericRepository<Parent> parentRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IGenericRepository<Subject> subjectRepo)
        {
            _parentRepo = parentRepo;
            _studentRepo = studentRepo;
            _homeworkRepo = homeworkRepo;
            _submissionRepo = submissionRepo;
            _subjectRepo = subjectRepo;
        }

        public async Task<List<StudentHomeworkDto>> Handle(GetStudentHomeworkQuery request, CancellationToken cancellationToken)
        {
            // 1. جلب بيانات الوالد من الـ UserId (الخاص بالـ Identity)
            var allParents = await _parentRepo.GetAllAsync();
            var parent = allParents.FirstOrDefault(p => p.UserId == request.ParentUserId);

            if (parent == null)
                throw new Exception("Parent profile not found.");

            // 2. جلب جميع الأبناء المرتبطين بهذا الوالد
            var allStudents = await _studentRepo.GetAllAsync();
            var studentIds = allStudents
                  .Where(s => s.ParentOid == parent.Oid)
                  .Select(s => new { s.Oid, s.ClassOid, s.FullName })
                  .ToList();

            if (!studentIds.Any())
                return new List<StudentHomeworkDto>();

            // 3. جلب البيانات الأساسية (الواجبات، المواد، التسليمات)
            var allHomeworks = await _homeworkRepo.GetAllAsync();
            var allSubmissions = await _submissionRepo.GetAllAsync();
            var allSubjects = await _subjectRepo.GetAllAsync();

            var resultList = new List<StudentHomeworkDto>();

            foreach (var student in studentIds)
            {
                // جلب واجبات الفصل الدراسي الخاص بالابن
                var classHomeworks = allHomeworks.Where(h => h.ClassOid == student.ClassOid).ToList();

                foreach (var homework in classHomeworks)
                {
                    // جلب تسليم الابن لهذا الواجب تحديداً
                    var submission = allSubmissions.FirstOrDefault(s =>
                        s.HomeworkOid == homework.Oid && s.StudentOid == student.Oid);

                    var subject = allSubjects.FirstOrDefault(sub => sub.Oid == homework.SubjectOid);

                    resultList.Add(new StudentHomeworkDto
                    {
                        StudentOid = student.Oid,
                        StudentName = student.FullName,
                        SubjectName = subject?.Name ?? "General",
                        Title = homework.Title,
                        DueDate = homework.DueDate,
                        Status = submission != null
                        ? submission.Status.ToString()
                        : (homework.DueDate < DateTime.Now ? "Overdue" : "Pending"),
                        Grade = submission?.Grade,
                        TotalMarks = homework.TotalMarks
                    });
                }
            }

            // ترتيب الواجبات حسب التاريخ (الأحدث أولاً أو حسب تاريخ الاستحقاق)
            return resultList.OrderBy(x => x.DueDate).ToList();
        }
    }
}