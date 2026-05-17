using AutoMapper;
using SchoolSystem.Application.Features.Timetable.DTOs;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Application.Mappings
{
    public class TimetableProfile : Profile
    {
        public TimetableProfile()
        {
            CreateMap<SchoolSystem.Domain.Entities.Timetable, TimetableDto>()
                .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.Name : null))
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Name : null))
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher != null ? src.Teacher.FullName : null))
                .ForMember(dest => dest.Day, opt => opt.MapFrom(src => src.Day.ToString()))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTime.HasValue ? src.StartTime.Value.ToString(@"hh\:mm") : null))
                .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => src.EndTime.HasValue ? src.EndTime.Value.ToString(@"hh\:mm") : null));

            CreateMap<CreateTimetableDto, SchoolSystem.Domain.Entities.Timetable>()
                .ForMember(dest => dest.Day, opt => opt.Ignore())
                .ForMember(dest => dest.StartTime, opt => opt.Ignore())
                .ForMember(dest => dest.EndTime, opt => opt.Ignore());

            CreateMap<UpdateTimetableDto, SchoolSystem.Domain.Entities.Timetable>()
                .ForMember(dest => dest.Day, opt => opt.Ignore())
                .ForMember(dest => dest.StartTime, opt => opt.Ignore())
                .ForMember(dest => dest.EndTime, opt => opt.Ignore())
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Timetable, TimetableSlotDto>()
                .ForMember(d => d.SubjectName, o => o.MapFrom(s => s.Subject.Name))
                .ForMember(d => d.TeacherName, o => o.MapFrom(s => s.Teacher.FullName))
                .ForMember(d => d.Time, o => o.MapFrom(s => $"{s.StartTime:hh\\:mm}-{s.EndTime:hh\\:mm}"))
                .ForMember(d => d.Room, o => o.MapFrom(s => s.Room))
                .ForMember(d => d.SubjectOid, o => o.MapFrom(s => s.SubjectOid))
                .ForMember(d => d.ClassOid, o => o.MapFrom(s => s.ClassOid))
                .ForMember(d => d.Day, o => o.MapFrom(s => s.Day.ToString()))
                .ForMember(d => d.StartTime, o => o.MapFrom(s => s.StartTime.ToString()))
                .ForMember(d => d.EndTime, o => o.MapFrom(s => s.EndTime.ToString()))
                .ForMember(d => d.Period, o => o.MapFrom(s => s.Period));
        }
    }
}