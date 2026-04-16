//using SchoolSystem.Application.Features.Homeworks.DTOs.Respones;
//using SchoolSystem.Application.Features.Lessons.DTOs.Create;
//using SchoolSystem.Application.Interfaces.Services;
//using SchoolSystem.Domain.Entities;
//using SchoolSystem.Domain.Interfaces.Common;
//using System;
//using System.Collections.Generic;
//using System.Text;

//namespace SchoolSystem.Infrastructure.Services
//{
//    //public class HomeworkService : IHomeworkService
//    {
//        private readonly IGenericRepository<Homework> _homeworkRepo;

//        public HomeworkService(IGenericRepository<Homework> homeworkRepo)
//        {
//            _homeworkRepo = homeworkRepo;
//        }

//        public async Task<bool> CreateHomeworkAsync(CreateHomeworkDto dto, Guid teacherId)
//        {
//            var homework = new Homework
//            {
//                Title = dto.Title,
//                Description = dto.Description,
//                DueDate = dto.DueDate,
//                TotalMarks = dto.TotalMarks,
//                TeacherId = teacherId,
//                ClassId = dto.ClassId,
//                SubjectId = dto.SubjectId
//            };

//            await _homeworkRepo.AddAsync(homework);
//            return true;
//        }

//        public async Task<IEnumerable<HomeworkResponseDto>> GetTeacherHomeworksAsync(Guid teacherId)
//        {
//            // 1. جلب كل البيانات من المستودع أولاً
//            var allHomeworks = await _homeworkRepo.GetAllAsync();

//            // 2. تصفية البيانات في الذاكرة وتحويلها إلى DTO
//            return allHomeworks
//                .Where(h => h.TeacherId == teacherId)
//                .Select(h => new HomeworkResponseDto
//                {
//                    Oid = h.Oid, 
//                    Title = h.Title,
//                    ClassName = h.Class?.Name ?? "N/A",
//                    DueDate = h.DueDate
//                });
//        }
//    }
//}
