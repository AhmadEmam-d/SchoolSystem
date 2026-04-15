using AutoMapper;
using SchoolSystem.Application.Features.Homeworks.DTOs;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Application.Mappings
{
    public class HomeworkProfile : Profile
    {
        public HomeworkProfile()
        {
            // ✅ أضف هذا السطر لتحويل ClassId و SubjectId
            CreateMap<CreateHomeworkDto, Homework>()
                .ForMember(dest => dest.Oid, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.AssignedDate, opt => opt.Ignore())
                .ForMember(dest => dest.TeacherOid, opt => opt.Ignore())
                .ForMember(dest => dest.Attachments, opt => opt.Ignore())
                .ForMember(dest => dest.Submissions, opt => opt.Ignore())
                // ✅ أضف هذين السطرين - المهمين جداً!
                .ForMember(dest => dest.ClassOid, opt => opt.MapFrom(src => src.ClassId))
                .ForMember(dest => dest.SubjectOid, opt => opt.MapFrom(src => src.SubjectId));

            // Mapping for HomeworkAttachment
            CreateMap<HomeworkAttachmentDto, HomeworkAttachment>()
                .ForMember(dest => dest.Oid, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.HomeworkOid, opt => opt.Ignore())
                .ForMember(dest => dest.Homework, opt => opt.Ignore());

            // Response mappings
            CreateMap<Homework, HomeworkListResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Oid))
                .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.Name : string.Empty))
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Name : string.Empty))
                .ForMember(dest => dest.SubmittedCount, opt => opt.MapFrom(src => src.Submissions.Count(s => !s.IsDeleted)));

            CreateMap<Homework, HomeworkDetailResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Oid))
                .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.Name : string.Empty))
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Name : string.Empty))
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher != null ? src.Teacher.FullName : string.Empty))
                .ForMember(dest => dest.Attachments, opt => opt.MapFrom(src => src.Attachments.Where(a => !a.IsDeleted)));

            CreateMap<HomeworkAttachment, HomeworkAttachmentDto>();
        }
    }
}