using AutoMapper;
using SchoolSystem.Application.Features.Classes.DTOs.Create;
using SchoolSystem.Application.Features.Classes.DTOs.Read;
using SchoolSystem.Application.Features.Classes.DTOs.Update;
using SchoolSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Mappings
{
    public class ClassMappingProfile : Profile
    {
        public ClassMappingProfile()
        {
            CreateMap<CreateClassDto, Class>();
            CreateMap<UpdateClassDto, Class>();
            CreateMap<Class, ClassResponseDto>()
                .ForMember(dest => dest.StudentsCount,
                    opt => opt.MapFrom(src => src.Students != null ? src.Students.Count(s => !s.IsDeleted) : 0))
                .ForMember(dest => dest.SectionsCount,
                    opt => opt.MapFrom(src => src.Sections != null ? src.Sections.Count(s => !s.IsDeleted) : 0));
        }
    }

}
