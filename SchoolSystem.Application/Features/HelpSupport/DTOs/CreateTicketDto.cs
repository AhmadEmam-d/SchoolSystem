// Application/Features/HelpSupport/DTOs/CreateTicketDto.cs
namespace SchoolSystem.Application.Features.HelpSupport.DTOs
{
    public class CreateTicketDto
    {
        public string Subject { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class TicketResponseDto
    {
        public Guid Oid { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Response { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? RespondedAt { get; set; }
    }

    public class FAQDto
    {
        public Guid Oid { get; set; }
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
    }

    public class KnowledgeBaseDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? VideoUrl { get; set; }
        public string? DocumentUrl { get; set; }
        public int ViewCount { get; set; }
    }
}