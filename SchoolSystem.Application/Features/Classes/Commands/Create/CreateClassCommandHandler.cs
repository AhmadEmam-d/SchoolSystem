using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Classes.Commands.Create
{
    public class CreateClassCommandHandler
        : IRequestHandler<CreateClassCommand, CreateClassCommandResponse>
    {
        private readonly IGenericRepository<Class> _repo;
        private readonly IMapper _mapper;

        public CreateClassCommandHandler(IGenericRepository<Class> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<CreateClassCommandResponse> Handle(CreateClassCommand request, CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<Class>(request.Class);
            entity.Oid = Guid.NewGuid();
            entity.CreatedAt = DateTime.UtcNow;

            await _repo.CreateAsync(entity);

            return new CreateClassCommandResponse { Oid = entity.Oid };
        }
    }
}