using AutoMapper;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Domain.Entities;

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
            .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src =>
                src.Exam != null && src.Exam.Subject != null ? src.Exam.Subject.Name : "N/A"))
            .ForMember(dest => dest.PassRate, opt => opt.MapFrom(src => src.IsPassed ? 100 : 0));

        CreateMap<IGrouping<string, ExamResult>, SubjectPerformanceSummaryDto>()
            .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Key))
            .ForMember(dest => dest.AverageScore, opt => opt.MapFrom(src =>
                Math.Round(src.Average(r => r.Percentage ?? 0), 1)))
            .ForMember(dest => dest.PassRate, opt => opt.MapFrom(src =>
                Math.Round((double)src.Count(r => r.IsPassed) / src.Count() * 100, 1)));

        CreateMap<List<SubjectPerformanceSummaryDto>, AcademicPerformanceDto>()
            .ForMember(dest => dest.Subjects, opt => opt.MapFrom(src => src));
    }
}