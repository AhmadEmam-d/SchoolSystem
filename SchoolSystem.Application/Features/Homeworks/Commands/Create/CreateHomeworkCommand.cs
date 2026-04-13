using MediatR;
using SchoolSystem.Application.Features.Homeworks.DTOs.Create;

namespace SchoolSystem.Application.Features.Homeworks.Commands.Create;

public record CreateHomeworkCommand(CreateHomeworksDto HomeworkDto, Guid TeacherId) : IRequest<bool>;