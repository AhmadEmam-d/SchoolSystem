using AutoMapper;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Application.Mappings
{
    public class ReportsProfile : Profile
    {
        public ReportsProfile()
        {
            CreateMap<Student, StudentReportItemDto>()
                .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.Name : "N/A"))
                .ForMember(dest => dest.EnrollmentDate, opt => opt.MapFrom(src => src.CreatedAt));

            CreateMap<StudentReport, StudentReportItemDto>();
            CreateMap<CreateStudentReportDto, StudentReport>();

            CreateMap<Teacher, TeacherActivityLogDto>()
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.FullName));

            CreateMap<CreateTeacherReportDto, TeacherReport>();

            CreateMap<CreateFinancialReportDto, FinancialReport>();

            CreateMap<ExamResult, SubjectPerformanceDto>()
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Exam.Subject.Name))
                .ForMember(dest => dest.PassRate, opt => opt.MapFrom(src => src.IsPassed ? 100 : 0));
        }
    }
}