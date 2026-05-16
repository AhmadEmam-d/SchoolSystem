// Infrastructure/Services/EmailService.cs
using SchoolSystem.Application.Features.Settings.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace SchoolSystem.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                var host = _configuration["EmailSettings:Host"];
                var port = int.Parse(_configuration["EmailSettings:Port"] ?? "587");
                var senderEmail = _configuration["EmailSettings:SenderEmail"];
                var password = _configuration["EmailSettings:Password"];
                var senderName = _configuration["EmailSettings:SenderName"] ?? "EduSmart";
                using var client = new SmtpClient(host, port)
                {
                    Credentials = new NetworkCredential(senderEmail, password),
                    EnableSsl = true
                };

                var message = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                message.To.Add(to);

                await client.SendMailAsync(message);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Email failed: {ex.Message}", ex);
            }
        }
        public async Task<bool> TestEmailConfigurationAsync(string testEmail, EmailServerConfigDto config)
        {
            try
            {
                // Password still comes from config since DTO doesn't have it
                var password = _configuration["EmailSettings:Password"];

                using var client = new SmtpClient(config.SmtpServer, config.Port)
                {
                    Credentials = new NetworkCredential(config.SenderEmail, password),
                    EnableSsl = config.UseSsl
                };

                var message = new MailMessage
                {
                    From = new MailAddress(config.SenderEmail, config.SenderName),
                    Subject = "Test Email Configuration - EduSmart",
                    Body = "<h2>Email configuration is working correctly!</h2>",
                    IsBodyHtml = true
                };
                message.To.Add(testEmail);

                await client.SendMailAsync(message);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}