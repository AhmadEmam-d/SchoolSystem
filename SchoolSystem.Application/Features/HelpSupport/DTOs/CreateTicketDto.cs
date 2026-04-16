// Application/Features/HelpSupport/DTOs/CreateTicketDto.cs
namespace SchoolSystem.Application.Features.HelpSupport.DTOs
{
    public class CreateTicketDto
    {
        public string Subject { get; set; }
        public string Category { get; set; }
        public string Message { get; set; }
    }

    public class TicketResponseDto
    {
        public Guid Oid { get; set; }
        public string Subject { get; set; }
        public string Category { get; set; }
        public string Message { get; set; }
        public string Status { get; set; }
        public string? Response { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? RespondedAt { get; set; }
    }

    public class FAQDto
    {
        public Guid Oid { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public string Category { get; set; }
    }

    public class KnowledgeBaseDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Category { get; set; }
        public string? VideoUrl { get; set; }
        public string? DocumentUrl { get; set; }
        public int ViewCount { get; set; }
    }
}