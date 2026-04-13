// Application/Features/SmartTutor/Commands/Chat/SmartTutorChatCommandHandler.cs
using MediatR;
using SchoolSystem.Application.Features.SmartTutor.DTOs;
using SchoolSystem.Application.Interfaces.Services;

namespace SchoolSystem.Application.Features.SmartTutor.Commands.Chat
{
    public class SmartTutorChatCommandHandler : IRequestHandler<SmartTutorChatCommand, SmartTutorResponseDto>
    {
        private readonly IGenAIService _aiService;

        public SmartTutorChatCommandHandler(IGenAIService aiService)
        {
            _aiService = aiService;
        }

        public async Task<SmartTutorResponseDto> Handle(SmartTutorChatCommand request, CancellationToken cancellationToken)
        {
            var conversationId = request.Request.ConversationId ?? Guid.NewGuid().ToString();

            // استدعاء AI الحقيقي
            var answer = await _aiService.GetChatResponseAsync(request.Request.Message);

            return new SmartTutorResponseDto
            {
                Message = answer,
                ConversationId = conversationId,
                Timestamp = DateTime.UtcNow,
                SuggestedQuestions = new List<string>
                {
                    "ما هي عاصمة فرنسا؟",
                    "اشرح لي نظرية النسبية",
                    "كيف أحسن لغتي الإنجليزية؟",
                    "ما هو البناء الضوئي؟"
                }
            };
        }
    }
}