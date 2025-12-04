using AutoMapper;
using SchoolSystem.Application.Features.Parents.DTOs.Create;
using SchoolSystem.Application.Features.Parents.DTOs.Read;
using SchoolSystem.Application.Features.Parents.DTOs.Update;
using SchoolSystem.Domain.Entities;

public class ParentProfile : Profile
{
    public ParentProfile()
    {
        // CreateParentDto -> Parent
        CreateMap<CreateParentDto, Parent>();

        // UpdateParentDto -> Parent
        CreateMap<UpdateParentDto, Parent>();

        // Parent -> ParentDto
        CreateMap<Parent, ParentDto>();
    }
}
