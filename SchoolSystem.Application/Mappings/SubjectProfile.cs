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
                .ForMember(dest => dest.Teachers, opt => opt.MapFrom(src =>
                    src.TeacherSubjects.Select(ts => ts.Teacher)));

            CreateMap<Teacher, TeacherBasicDto>();
        }
    }
}
