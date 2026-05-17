// Application/Mappings/ParentPaymentProfile.cs
using AutoMapper;
using SchoolSystem.Application.Features.ParentPayments.DTOs.Read;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Application.Mappings
{
    public class ParentPaymentProfile : Profile
    {
        public ParentPaymentProfile()
        {
            CreateMap<FeeInvoice, ParentPaymentHistoryDto>()
                .ForMember(dest => dest.InvoiceId, opt => opt.MapFrom(src => src.Oid))
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src =>
                    src.Student != null
                        ? (src.Student.User != null ? src.Student.User.FullName : src.Student.FullName)
                        : string.Empty))
                .ForMember(dest => dest.CanPay, opt => opt.Ignore())
                .ForMember(dest => dest.RemainingAmount, opt => opt.MapFrom(src => src.RemainingAmount));

            CreateMap<FeeInvoice, ParentReceiptDto>()
                .ForMember(dest => dest.PaymentDate, opt => opt.MapFrom(src => src.PaidDate ?? src.CreatedAt))
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src =>
                    src.Student != null
                        ? (src.Student.User != null ? src.Student.User.FullName : src.Student.FullName)
                        : string.Empty));
        }
    }
}