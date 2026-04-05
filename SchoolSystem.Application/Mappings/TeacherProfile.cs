using AutoMapper;
using SchoolSystem.Application.Features.Teachers.DTOs;
using SchoolSystem.Application.Features.Teachers.DTOs.Create;
using SchoolSystem.Application.Features.Teachers.DTOs.Update;
using SchoolSystem.Domain.Entities;
using static SchoolSystem.Application.Features.Teachers.DTOs.TeacherResponseDto;


namespace SchoolSystem.Application.Mappings
{
    public class TeacherProfile : Profile
    {
        public TeacherProfile()
        {
            CreateMap<CreateTeacherDto, Teacher>();
            CreateMap<UpdateTeacherDto, Teacher>();

            CreateMap<Teacher, TeacherResponseDto>()
                .ForMember(dest => dest.Subjects, opt => opt.MapFrom(src =>
                    src.TeacherSubjects.Select(ts => ts.Subject)));

            CreateMap<Subject, SubjectBasicDto>();
        }
    }

}

