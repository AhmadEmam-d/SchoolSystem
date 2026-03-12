using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SchoolSystem.Application.Features.Subjects.Commands.Create
{
    public class CreateSubjectCommandHandler : IRequestHandler<CreateSubjectCommand, CreateSubjectCommandResponse>
    {
        private readonly IGenericRepository<Subject> _repo;
        private readonly IMapper _mapper;

        public CreateSubjectCommandHandler(IGenericRepository<Subject> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<CreateSubjectCommandResponse> Handle(CreateSubjectCommand request, CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<Subject>(request.Subject);

            await _repo.AddAsync(entity);

            return new CreateSubjectCommandResponse { Oid = entity.Oid };
        }
    }
}