using AutoMapper;
using SchoolSystem.Application.Features.Timetable.DTOs;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Application.Profiles
{
    public class TimetableProfile : Profile
    {
        public TimetableProfile()
        {
            // Entity to DTO
            CreateMap<SchoolSystem.Domain.Entities.Timetable, TimetableDto>()
                .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.Name : null))
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Name : null))
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher != null ? src.Teacher.FullName : null))
                .ForMember(dest => dest.Day, opt => opt.MapFrom(src => src.Day.ToString()))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTime.ToString(@"hh\:mm")))
                .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => src.EndTime.ToString(@"hh\:mm")));

            // DTO to Entity (Create)
            CreateMap<CreateTimetableDto, SchoolSystem.Domain.Entities.Timetable>()
                .ForMember(dest => dest.Day, opt => opt.Ignore())
                .ForMember(dest => dest.StartTime, opt => opt.Ignore())
                .ForMember(dest => dest.EndTime, opt => opt.Ignore());

            // DTO to Entity (Update)
            CreateMap<UpdateTimetableDto, SchoolSystem.Domain.Entities.Timetable>()
                .ForMember(dest => dest.Day, opt => opt.Ignore())
                .ForMember(dest => dest.StartTime, opt => opt.Ignore())
                .ForMember(dest => dest.EndTime, opt => opt.Ignore())
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}