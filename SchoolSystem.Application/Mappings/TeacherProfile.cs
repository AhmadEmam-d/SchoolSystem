using AutoMapper;
using SchoolSystem.Application.Features.Teachers.DTOs;
using SchoolSystem.Application.Features.Teachers.DTOs.Create;
using SchoolSystem.Application.Features.Teachers.DTOs.Create.SchoolSystem.Application.Features.Teachers.DTOs.Create;
using SchoolSystem.Application.Features.Teachers.DTOs.Update;
using SchoolSystem.Application.Features.Teachers.DTOs.Update.SchoolSystem.Application.Features.Teachers.DTOs.Update;
using SchoolSystem.Domain.Entities;

public class TeacherProfile : Profile
{
    public TeacherProfile()
    {
        CreateMap<CreateTeacherDto, Teacher>();

        CreateMap<UpdateTeacherDto, Teacher>();
        CreateMap<Teacher, TeacherResponseDto>();
    }
}
