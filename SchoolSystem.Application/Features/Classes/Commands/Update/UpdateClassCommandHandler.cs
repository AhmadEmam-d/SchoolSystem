using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.Commands.Update
{
    public class UpdateClassCommandHandler
        : IRequestHandler<UpdateClassCommand>
    {
        private readonly IGenericRepository<Class> _repo;
        private readonly IMapper _mapper;

        public UpdateClassCommandHandler(IGenericRepository<Class> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdateClassCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repo.GetByOidAsync(request.Id);
            if (entity == null) throw new Exception("Class not found");

            _mapper.Map(request.ClassDto, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(entity);
            return Unit.Value;
        }
    }

}
