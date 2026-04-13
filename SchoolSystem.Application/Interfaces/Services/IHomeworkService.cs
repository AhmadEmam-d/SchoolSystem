using SchoolSystem.Application.Features.Homeworks.DTOs.Respones;
using SchoolSystem.Application.Features.Lessons.DTOs.Create;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Interfaces.Services
{
    public interface IHomeworkService
    {
        Task<bool> CreateHomeworkAsync(CreateHomeworkDto dto, Guid teacherId);
        Task<IEnumerable<HomeworkResponseDto>> GetTeacherHomeworksAsync(Guid teacherId);
    }
}
