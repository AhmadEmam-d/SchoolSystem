using AutoMapper.Features;
using SchoolSystem.Application.Features.Settings.Commands.Update;
using SchoolSystem.Application.Features.Settings.DTOs;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Net.Mime.MediaTypeNames;


namespace SchoolSystem.Application.Features.Settings.Commands.Update
{
    public class UpdateSettingsCommandResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public Guid? Oid { get; set; }
    }

    public class CreateBackupCommandResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public SystemBackupDto? Backup { get; set; }
    }

    public class TestEmailConfigCommandResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
    }
}