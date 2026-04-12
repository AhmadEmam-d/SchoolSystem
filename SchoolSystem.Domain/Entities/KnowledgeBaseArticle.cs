// Domain/Entities/KnowledgeBaseArticle.cs
using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class KnowledgeBaseArticle : BaseEntity
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Category { get; set; }
        public string? VideoUrl { get; set; }
        public string? DocumentUrl { get; set; }
        public int ViewCount { get; set; }
        public bool IsPublished { get; set; }
    }
}