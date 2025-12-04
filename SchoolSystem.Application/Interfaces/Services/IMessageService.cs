using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Interfaces.Services
{
    public interface IMessageService
    {
        Dictionary<string, string> GetMessage(string key);
    }
}
