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
            // Create mapping
            CreateMap<CreateExamDto, Exam>()
               .ForMember(dest => dest.Oid, opt => opt.Ignore())
               .ForMember(dest => dest.TeacherOid, opt => opt.Ignore())
               .ForMember(dest => dest.Status, opt => opt.Ignore())
               .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
               .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
               .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
               .ForMember(dest => dest.Results, opt => opt.Ignore())
               .ForMember(dest => dest.Type, opt => opt.MapFrom(src => Enum.Parse(typeof(ExamType), src.Type)))
               .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => TimeSpan.Parse(src.StartTime)))
               .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => TimeSpan.Parse(src.Duration)));

            // Update mapping
            CreateMap<UpdateExamDto, Exam>()
                .ForMember(dest => dest.TeacherOid, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            // Response mapping
            CreateMap<Exam, ExamDto>()
                 .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Name : string.Empty))
                 .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.Name : string.Empty))
                 .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
                 .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                 .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTime.ToString(@"hh\:mm")))
                 .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => src.Duration.ToString(@"hh\:mm")));

            // Result mapping
            CreateMap<ExamResult, ExamResultDto>()
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student != null ? src.Student.FullName : string.Empty))
                .ForMember(dest => dest.ExamName, opt => opt.MapFrom(src => src.Exam != null ? src.Exam.Name : string.Empty));
        }
    }
}