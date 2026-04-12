using MediatR;
using SchoolSystem.Application.Features.SmartTutor.DTOs;

namespace SchoolSystem.Application.Features.SmartTutor.Commands.Chat
{
    public class SmartTutorChatCommand : IRequest<SmartTutorResponseDto>
    {
        public SmartTutorRequestDto Request { get; set; }
        public Guid UserId { get; set; }
        public string UserRole { get; set; }

        public SmartTutorChatCommand(SmartTutorRequestDto request, Guid userId, string userRole)
        {
            Request = request;
            UserId = userId;
            UserRole = userRole;
        }
    }
}