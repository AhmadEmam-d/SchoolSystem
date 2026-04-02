using MediatR;
using SchoolSystem.Application.Features.Messages.DTOs;
using System;

namespace SchoolSystem.Application.Features.Messages.Queries.GetById
{
    public class GetMessageByIdQuery : IRequest<MessageDto>
    {
        public Guid Oid { get; set; }

        public GetMessageByIdQuery(Guid oid)
        {
            Oid = oid;
        }
    }
}