using AutoMapper;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Application.Profiles
{
    public class AttendanceProfile : Profile
    {
        public AttendanceProfile()
        {
            // Entity to DTO
            CreateMap<SchoolSystem.Domain.Entities.Attendance, AttendanceDto>()
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student.FullName))
                .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class.Name))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.CheckInTime, opt => opt.MapFrom(src => src.CheckInTime.HasValue ? src.CheckInTime.Value.ToString(@"hh\:mm") : null))
                .ForMember(dest => dest.CheckOutTime, opt => opt.MapFrom(src => src.CheckOutTime.HasValue ? src.CheckOutTime.Value.ToString(@"hh\:mm") : null));

            // DTO to Entity (Create)
            CreateMap<CreateAttendanceDto, SchoolSystem.Domain.Entities.Attendance>()
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.CheckInTime, opt => opt.Ignore())
                .ForMember(dest => dest.CheckOutTime, opt => opt.Ignore());

            // DTO to Entity (Update)
            CreateMap<UpdateAttendanceDto, SchoolSystem.Domain.Entities.Attendance>()
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.CheckInTime, opt => opt.Ignore())
                .ForMember(dest => dest.CheckOutTime, opt => opt.Ignore());
        }
    }
}