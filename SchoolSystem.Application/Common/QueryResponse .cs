using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Application.Common
{
    public interface IPaginatedResponse<T>
    {
        List<T> Data { get; set; }
        int TotalItems { get; set; }
        int TotalPages { get; set; }
    }

    public class QueryResponse<T> : IPaginatedResponse<T>
    {
        public string? Message { get; set; }
        public bool Success { get; set; }
        public List<T> Data { get; set; } = new();
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }




}
