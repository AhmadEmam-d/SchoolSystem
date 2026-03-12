using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Sections.Commands.Update
{
    public class UpdateSectionCommandHandler
        : IRequestHandler<UpdateSectionCommand, UpdateSectionCommandResponse>
    {
        private readonly IGenericRepository<Section> _repo;
        private readonly IMapper _mapper;

        public UpdateSectionCommandHandler(IGenericRepository<Section> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<UpdateSectionCommandResponse> Handle(UpdateSectionCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repo.GetByOidAsync(request.Oid);
            if (entity == null)
                throw new Exception($"Section with Oid {request.Oid} not found.");

            _mapper.Map(request.Section, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(entity);

            return new UpdateSectionCommandResponse
            {
                Oid = entity.Oid
            };
        }
    }
}