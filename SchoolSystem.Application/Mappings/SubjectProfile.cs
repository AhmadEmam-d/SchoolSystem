using AutoMapper;
using SchoolSystem.Application.Features.Subjects.DTOs;
using SchoolSystem.Application.Features.Subjects.DTOs.Create;
using SchoolSystem.Application.Features.Subjects.DTOs.Update.SchoolSystem.Application.Features.Subjects.DTOs.Update;
using SchoolSystem.Domain.Entities;
using static SchoolSystem.Application.Features.Subjects.DTOs.SubjectResponseDto;

namespace SchoolSystem.Application.Mappings
{
    public class SubjectProfile : Profile
    {
        public SubjectProfile()
        {
            CreateMap<CreateSubjectDto, Subject>();
            CreateMap<UpdateSubjectDto, Subject>();

            CreateMap<Subject, SubjectResponseDto>()
                 .ForMember(dest => dest.Code,
                    opt => opt.MapFrom(src => src.Name.Substring(0, Math.Min(3, src.Name.Length)).ToUpper()))
                .ForMember(dest => dest.TeachersCount,
                    opt => opt.MapFrom(src => src.TeacherSubjects != null ?
                        src.TeacherSubjects.Count(ts => !ts.IsDeleted) : 0))
                .ForMember(dest => dest.ActiveClassesCount,
                    opt => opt.MapFrom(src => 0)) // يمكن تعديلها حسب الحاجة
                .ForMember(dest => dest.Teachers,
                    opt => opt.MapFrom(src => src.TeacherSubjects != null ?
                        src.TeacherSubjects.Where(ts => !ts.IsDeleted).Select(ts => ts.Teacher) : new List<Teacher>()));

            CreateMap<Teacher, TeacherBasicDto>();
        }
    }
}
