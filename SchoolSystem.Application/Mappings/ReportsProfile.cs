using AutoMapper;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Application.Mappings
{
    public class ReportsProfile : Profile
    {
        public ReportsProfile()
        {
            // Student Report mappings
            CreateMap<Student, StudentReportItemDto>()
                .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.Name : "N/A"))
                .ForMember(dest => dest.EnrollmentDate, opt => opt.MapFrom(src => src.CreatedAt));

            CreateMap<StudentReport, StudentReportItemDto>();
            CreateMap<CreateStudentReportDto, StudentReport>();

            // Teacher Report mappings
            CreateMap<Teacher, TeacherActivityLogDto>()
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.FullName));

            CreateMap<CreateTeacherReportDto, TeacherReport>();

            // Financial Report mappings
            CreateMap<CreateFinancialReportDto, FinancialReport>();

            // Exam Result mappings for reports
            CreateMap<ExamResult, SubjectPerformanceDto>()
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Exam.Subject.Name))
                .ForMember(dest => dest.PassRate, opt => opt.MapFrom(src => src.IsPassed ? 100 : 0));
        }
    }
}