using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Interfaces.Services
{
    public interface IGenAIService
    {
        Task<string> GetChatResponseAsync(string message);
    }
}
