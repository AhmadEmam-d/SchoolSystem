using AutoMapper;
using SchoolSystem.Application.Features.Homeworks.DTOs;
using SchoolSystem.Application.Features.StudentHomeworks.DTOs;
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

            // ========== ✅ أضف هذه الـ Mappings للطالب ==========

            // Student Homework Dashboard Mapping
            CreateMap<Homework, HomeworkSummaryDto>()
                .ForMember(dest => dest.HomeworkId, opt => opt.MapFrom(src => src.Oid))
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Name : "N/A"))
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher != null ? src.Teacher.FullName : "N/A"))
                .ForMember(dest => dest.IsOverdue, opt => opt.MapFrom(src => src.DueDate < DateTime.UtcNow))
                .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => GetPriority(src.DueDate)))
                .ForMember(dest => dest.Grade, opt => opt.Ignore()) // Will be set manually
                .ForMember(dest => dest.Status, opt => opt.Ignore()); // Will be set manually

            // Homework Details Mapping
            CreateMap<Homework, HomeworkDetailsDto>()
                .ForMember(dest => dest.HomeworkId, opt => opt.MapFrom(src => src.Oid))
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Name : "N/A"))
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher != null ? src.Teacher.FullName : "N/A"))
                .ForMember(dest => dest.IsOverdue, opt => opt.MapFrom(src => src.DueDate < DateTime.UtcNow))
                .ForMember(dest => dest.OverdueText, opt => opt.MapFrom(src => GetOverdueText(src.DueDate)))
                .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => GetPriority(src.DueDate)))
                .ForMember(dest => dest.Attachments, opt => opt.MapFrom(src => src.Attachments.Where(a => !a.IsDeleted)))
                .ForMember(dest => dest.MySubmission, opt => opt.Ignore()); // Will be set manually

            // HomeworkAttachment to AttachmentDto
            CreateMap<HomeworkAttachment, AttachmentDto>()
                .ForMember(dest => dest.SizeText, opt => opt.MapFrom(src => FormatFileSize(src.FileSize)));

            // HomeworkSubmission to StudentSubmissionDto
            CreateMap<HomeworkSubmission, StudentSubmissionDto>()
                .ForMember(dest => dest.SubmissionId, opt => opt.MapFrom(src => src.Oid))
                .ForMember(dest => dest.SubmissionText, opt => opt.MapFrom(src => src.Content))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

            CreateMap<HomeworkSubmission, HomeworkSubmissionResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Oid))
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student != null ? src.Student.FullName : "N/A"))
                .ForMember(dest => dest.StudentEmail, opt => opt.MapFrom(src => src.Student != null ? src.Student.Email : "N/A"))
                .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
                .ForMember(dest => dest.AttachmentUrl, opt => opt.MapFrom(src => src.AttachmentUrl))
                .ForMember(dest => dest.SubmittedAt, opt => opt.MapFrom(src => src.SubmittedAt))
                .ForMember(dest => dest.Grade, opt => opt.MapFrom(src => src.Grade))
                .ForMember(dest => dest.Feedback, opt => opt.MapFrom(src => src.Feedback))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.IsLate, opt => opt.MapFrom(src => src.Status == SubmissionStatus.Late));
        }

        // Helper methods
        private string GetPriority(DateTime dueDate)
        {
            var daysLeft = (dueDate - DateTime.UtcNow).Days;
            if (daysLeft <= 2) return "high";
            if (daysLeft <= 5) return "medium";
            return "low";
        }

        private string GetOverdueText(DateTime dueDate)
        {
            var daysOverdue = (DateTime.UtcNow - dueDate).Days;
            if (daysOverdue > 0)
                return $"Overdue by {daysOverdue} days";
            return "";
        }

        private string FormatFileSize(long bytes)
        {
            if (bytes >= 1048576)
                return $"{bytes / 1048576.0:F1} MB";
            if (bytes >= 1024)
                return $"{bytes / 1024.0:F1} KB";
            return $"{bytes} B";
        }
    }
}