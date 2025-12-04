using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.Commands.Create
{
    public class CreateClassCommandHandler
        : IRequestHandler<CreateClassCommand, Guid>
    {
        private readonly IGenericRepository<Class> _repo;
        private readonly IMapper _mapper;

        public CreateClassCommandHandler(IGenericRepository<Class> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateClassCommand request, CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<Class>(request.ClassDto);
            entity.Oid = Guid.NewGuid();
            entity.CreatedAt = DateTime.UtcNow;

            await _repo.AddAsync(entity);
            return entity.Oid;
        }
    }

}
