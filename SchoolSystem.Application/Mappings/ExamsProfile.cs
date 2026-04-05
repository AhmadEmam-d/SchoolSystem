using AutoMapper;
using SchoolSystem.Application.Features.Exams.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;

namespace SchoolSystem.Application.Mappings
{
    public class ExamsProfile : Profile
    {
        public ExamsProfile()
        {
            // Exam mappings
            CreateMap<Exam, ExamDto>()
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject.Name))
                .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class.Name))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTime.ToString(@"hh\:mm")))
                .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => src.Duration.ToString(@"hh\:mm")))
                .ForMember(dest => dest.Statistics, opt => opt.Ignore());

            CreateMap<CreateExamDto, Exam>()
                .ForMember(dest => dest.Type, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ExamStatus.Pending))
                .ForMember(dest => dest.StartTime, opt => opt.Ignore())
                .ForMember(dest => dest.Duration, opt => opt.Ignore());

            CreateMap<UpdateExamDto, Exam>()
                .ForMember(dest => dest.Type, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // ExamResult mappings
            CreateMap<ExamResult, ExamResultDto>()
                .ForMember(dest => dest.ExamName, opt => opt.MapFrom(src => src.Exam.Name))
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student.FullName))
                .ForMember(dest => dest.Grade, opt => opt.MapFrom(src => src.Grade ?? "-"));

            CreateMap<CreateExamResultDto, ExamResult>()
                .ForMember(dest => dest.Percentage, opt => opt.Ignore())
                .ForMember(dest => dest.Grade, opt => opt.Ignore())
                .ForMember(dest => dest.IsPassed, opt => opt.Ignore())
                .ForMember(dest => dest.SubmittedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<UpdateExamResultDto, ExamResult>()
                .ForMember(dest => dest.Percentage, opt => opt.Ignore())
                .ForMember(dest => dest.Grade, opt => opt.Ignore())
                .ForMember(dest => dest.IsPassed, opt => opt.Ignore())
                .ForMember(dest => dest.GradedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}