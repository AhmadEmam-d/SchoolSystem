using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Common.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public Dictionary<string, string> Messages { get; set; } = new();
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public ApiResponse() { }
        public ApiResponse(bool success, Dictionary<string, string> messages, T? data = default, List<string>? errors = null)
        {
            Success = success;
            Messages = messages;
            Data = data;
            Errors = errors;
        }
    }
}
