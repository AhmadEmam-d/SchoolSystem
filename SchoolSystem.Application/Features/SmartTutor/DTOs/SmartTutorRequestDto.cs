namespace SchoolSystem.Application.Features.SmartTutor.DTOs
{
    public class SmartTutorRequestDto
    {
        public string Message { get; set; } = string.Empty;
        public string? ConversationId { get; set; }
    }

    public class SmartTutorResponseDto
    {
        public string Message { get; set; }= string.Empty;
        public string ConversationId { get; set; }=string.Empty;
        public DateTime Timestamp { get; set; }
        public List<string> SuggestedQuestions { get; set; } = new List<string>();
    }

    public class SmartTutorConversationDto
    {
        public string ConversationId { get; set; }= string.Empty;
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}