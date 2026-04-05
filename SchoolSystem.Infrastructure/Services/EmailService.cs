// Infrastructure/Services/EmailService.cs
using SchoolSystem.Application.Features.Settings.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace SchoolSystem.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        public async Task<bool> SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                // Implementation
                await Task.Delay(100);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> TestEmailConfigurationAsync(string testEmail, EmailServerConfigDto config)
        {
            try
            {
                // Implementation
                await Task.Delay(100);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}