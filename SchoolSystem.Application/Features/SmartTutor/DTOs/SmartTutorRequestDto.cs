namespace SchoolSystem.Application.Features.SmartTutor.DTOs
{
    public class SmartTutorRequestDto
    {
        public string Message { get; set; }
        public string? ConversationId { get; set; }
    }

    public class SmartTutorResponseDto
    {
        public string Message { get; set; }
        public string ConversationId { get; set; }
        public DateTime Timestamp { get; set; }
        public List<string> SuggestedQuestions { get; set; }
    }

    public class SmartTutorConversationDto
    {
        public string ConversationId { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public DateTime Timestamp { get; set; }
    }
}