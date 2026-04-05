using SchoolSystem.Application.Features.Settings.DTOs;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Interfaces.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string to, string subject, string body);
        Task<bool> TestEmailConfigurationAsync(string testEmail, EmailServerConfigDto config);
    }
}