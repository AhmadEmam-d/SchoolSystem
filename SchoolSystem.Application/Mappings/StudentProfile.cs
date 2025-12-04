using AutoMapper;
using SchoolSystem.Application.Features.Students.DTOs.Create;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using SchoolSystem.Application.Features.Students.DTOs.Update;
using SchoolSystem.Domain.Entities;

public class StudentProfile : Profile
{
    public StudentProfile()
    {
        CreateMap<Student, StudentDto>().ReverseMap();
        CreateMap<CreateStudentDto, Student>();
        CreateMap<UpdateStudentDto, Student>();
    }
}
