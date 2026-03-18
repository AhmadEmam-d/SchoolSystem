using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Common;


namespace SchoolSystem.Api.Common.Helpers
{
    public static class ApiResponseFactory
    {

        public static ApiResponse<T> Success<T>(T data, string messageKey, IMessageService messageService)
        {
            return new ApiResponse<T>
            {
                Success = true,
                Data = data,
                Messages = messageService.GetMessage(messageKey)
            };
        }

        

        public static ApiResponse<object> SuccessPaged<T>(IPaginatedResponse<T> response, string messageKey, IMessageService messageService)
        {
            var payload = new
            {
                data = response.Data,
                totalItems = response.TotalItems,
                totalPages = response.TotalPages
            };

            return new ApiResponse<object>
            {
                Success = true,
                Data = payload,
                Messages = messageService.GetMessage(messageKey)
            };
        }



        public static ApiResponse<T> Failure<T>(string messageKey, IMessageService messageService, List<string>? errors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Data = default,
                Messages = messageService.GetMessage(messageKey),
                Errors = errors ?? new List<string>()
            };
        }

        public static ApiResponse<T> FailureWithRawMessage<T>(T message)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Messages = new Dictionary<string, string> { { "Error", message?.ToString() ?? string.Empty } },
                Data = default,
                Errors = new List<string>(),
                Timestamp = DateTime.UtcNow
            };
        }
    }
}
