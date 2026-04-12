// Infrastructure/Services/OpenRouterAIService.cs
using Microsoft.Extensions.Configuration;
using SchoolSystem.Application.Interfaces.Services;
using System.Text;
using System.Text.Json;

namespace SchoolSystem.Infrastructure.Services
{
    public class OpenRouterAIService : IGenAIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public OpenRouterAIService(IConfiguration configuration)
        {
            _apiKey = configuration["OpenRouter:ApiKey"];
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
        }

        public async Task<string> GetChatResponseAsync(string message)
        {
            var requestBody = new
            {
                model = "google/gemini-2.0-flash-lite-001",
                messages = new[]
                {
                    new { role = "user", content = message }
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://openrouter.ai/api/v1/chat/completions", content);
            var responseJson = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var result = JsonSerializer.Deserialize<OpenRouterResponse>(responseJson);
                return result?.Choices?[0]?.Message?.Content ?? "عذراً، لم أتمكن من الرد.";
            }

            return $"⚠️ خطأ: {response.StatusCode} - {responseJson}";
        }

        private class OpenRouterResponse
        {
            public Choice[] Choices { get; set; }
        }

        private class Choice
        {
            public Message Message { get; set; }
        }

        private class Message
        {
            public string Content { get; set; }
        }
    }
}