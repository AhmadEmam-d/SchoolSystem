using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace SchoolSystem.Infrastructure.Services
{
    public class MessageService : IMessageService
    {
        private readonly Dictionary<string, Dictionary<string, string>> _messages;

        public MessageService()
        {
            var path = Path.Combine(AppContext.BaseDirectory, "messages.json");
            var json = File.ReadAllText(path);
            _messages = JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, string>>>(json)!;
        }

        public Dictionary<string, string> GetMessage(string key)
        {
            if (_messages.TryGetValue(key, out var message))
            {
                return message;
            }
            else
            {
                return new Dictionary<string, string> { { "Error", "Message not found." } };
            }
        }
    }
}
