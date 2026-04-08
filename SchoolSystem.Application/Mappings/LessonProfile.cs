// Application/Features/Lessons/Mapping/LessonProfile.cs
using AutoMapper;
using SchoolSystem.Application.Features.Lessons.DTOs;
using SchoolSystem.Application.Features.Lessons.DTOs.Create;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Application.Mapping
{
    public class LessonProfile : Profile
    {
        public LessonProfile()
        {
            // Create mappings
            CreateMap<CreateLessonDto, Lesson>()
                .ForMember(dest => dest.Oid, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.Duration, opt => opt.Ignore())
                .ForMember(dest => dest.TeacherOid, opt => opt.Ignore())
                .ForMember(dest => dest.Objectives, opt => opt.Ignore())
                .ForMember(dest => dest.Materials, opt => opt.Ignore())
                .ForMember(dest => dest.Homeworks, opt => opt.Ignore());

            CreateMap<CreateMaterialDto, LessonMaterial>()
                .ForMember(dest => dest.Oid, opt => opt.Ignore())
                .ForMember(dest => dest.LessonOid, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore());

            CreateMap<CreateHomeworkDto, LessonHomework>()
                .ForMember(dest => dest.Oid, opt => opt.Ignore())
                .ForMember(dest => dest.LessonOid, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore());

            // Update mappings
            CreateMap<UpdateLessonDto, Lesson>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.Duration, opt => opt.Ignore())
                .ForMember(dest => dest.Objectives, opt => opt.Ignore())
                .ForMember(dest => dest.Materials, opt => opt.Ignore())
                .ForMember(dest => dest.Homeworks, opt => opt.Ignore());

            CreateMap<UpdateMaterialDto, LessonMaterial>()
                .ForMember(dest => dest.LessonOid, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            CreateMap<UpdateHomeworkDto, LessonHomework>()
                .ForMember(dest => dest.LessonOid, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            // Response mappings
            CreateMap<Lesson, LessonResponseDto>()
                .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.Name : null))
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Name : null))
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher != null ? src.Teacher.FullName : null))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
                .ForMember(dest => dest.ObjectivesCount, opt => opt.MapFrom(src => src.Objectives.Count(o => !o.IsDeleted)))
                .ForMember(dest => dest.MaterialsCount, opt => opt.MapFrom(src => src.Materials.Count(m => !m.IsDeleted)))
                .ForMember(dest => dest.HasHomework, opt => opt.MapFrom(src => src.Homeworks.Any(h => !h.IsDeleted)))
                .ForMember(dest => dest.Objectives, opt => opt.MapFrom(src => src.Objectives.Where(o => !o.IsDeleted).OrderBy(o => o.Order)))
                .ForMember(dest => dest.Materials, opt => opt.MapFrom(src => src.Materials.Where(m => !m.IsDeleted)))
                .ForMember(dest => dest.Homework, opt => opt.MapFrom(src => src.Homeworks.FirstOrDefault(h => !h.IsDeleted)))
                .ForMember(dest => dest.ResourceLinks, opt => opt.Ignore());

            CreateMap<LessonObjective, ObjectiveResponseDto>();
            CreateMap<LessonMaterial, MaterialResponseDto>();
            CreateMap<LessonHomework, HomeworkResponseDto>();
        }
    }
}