using AutoMapper;
using SchoolSystem.Application.Features.Homeworks.DTOs.Create;
using SchoolSystem.Application.Features.Homeworks.DTOs.Get;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Application.Mappings.Homeworks;

public class HomeworkProfile : Profile
{
    public HomeworkProfile()
    {
        // Create
        CreateMap<CreateHomeworksDto, Homework>()
            .ForMember(dest => dest.TeacherId, opt => opt.Ignore())
            .ForMember(dest => dest.Teacher, opt => opt.Ignore())
            .ForMember(dest => dest.Class, opt => opt.Ignore())
            .ForMember(dest => dest.Subject, opt => opt.Ignore())
            .ForMember(dest => dest.Submissions, opt => opt.Ignore());

        // Get List
        CreateMap<Homework, HomeworkListDto>()
            .ForMember(dest => dest.ClassName,
                opt => opt.MapFrom(src => src.Class.Name))
            .ForMember(dest => dest.SubjectName,
                opt => opt.MapFrom(src => src.Subject.Name))
            .ForMember(dest => dest.SubmittedCount,
                opt => opt.MapFrom(src => src.Submissions.Count))
            .ForMember(dest => dest.TotalStudents,
                opt => opt.Ignore())
            .ForMember(dest => dest.Status,
                opt => opt.MapFrom(src => GetStatus(src)));
    }

    private static string GetStatus(Homework homework)
    {
        if (homework.Submissions.Count == 0)
            return "Active";

        bool allGraded = homework.Submissions.All(s => s.IsGraded);
        return allGraded ? "Completed" : "Grading";
    }
}
