using AutoMapper;
using SchoolSystem.Application.Features.Sections.DTOs.Read;
using SchoolSystem.Application.Features.Teachers.DTOs;
using SchoolSystem.Application.Features.Teachers.DTOs.Create;
using SchoolSystem.Application.Features.Teachers.DTOs.Update;
using SchoolSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using static SchoolSystem.Application.Features.Teachers.DTOs.TeacherResponseDto;

public class TeacherProfile : Profile
{
    public TeacherProfile()
    {
        CreateMap<CreateTeacherDto, Teacher>();
        CreateMap<UpdateTeacherDto, Teacher>();

        // Main Teacher mapping with all navigation properties
        CreateMap<Teacher, TeacherResponseDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User != null ? src.User.FullName : null))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.Subjects, opt => opt.MapFrom(src => src.TeacherSubjects.Select(ts => ts.Subject)))
            .ForMember(dest => dest.AcademicSummary, opt => opt.Ignore())
            .ForMember(dest => dest.Students, opt => opt.Ignore());

        // Subject mapping
        CreateMap<Subject, SubjectBasicDto>();

        // Class mapping with computed StudentsCount
        CreateMap<Class, TeacherClassBasicDto>()
            .ForMember(dest => dest.StudentsCount, opt => opt.MapFrom(src =>
                src.Students != null ? src.Students.Count(s => !s.IsDeleted) : 0));

        // Student mapping with computed fields
        CreateMap<Student, StudentBasicDto>()
            .ForMember(dest => dest.ClassName, opt => opt.Ignore())
            .ForMember(dest => dest.AttendancePercentage, opt => opt.Ignore())
            .ForMember(dest => dest.AverageGrade, opt => opt.Ignore());

        // Lesson mapping
        CreateMap<Lesson, LessonBasicDto>()
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src =>
                src.Class != null ? src.Class.Name ?? string.Empty : string.Empty))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        // Homework mapping
        CreateMap<Homework, HomeworkBasicDto>()
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src =>
                src.Class != null ? src.Class.Name ?? string.Empty : string.Empty))
            .ForMember(dest => dest.SubmissionsCount, opt => opt.MapFrom(src =>
                src.Submissions != null ? src.Submissions.Count : 0))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        // Exam mapping
        CreateMap<Exam, ExamBasicDto>()
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src =>
                src.Class != null ? src.Class.Name ?? string.Empty : string.Empty))
            .ForMember(dest => dest.AverageGrade, opt => opt.MapFrom(src =>
                src.Results != null && src.Results.Any(r => r.Score > 0)
                    ? src.Results.Where(r => r.Score > 0).Average(r => (double)r.Score) : 0))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
    }
}