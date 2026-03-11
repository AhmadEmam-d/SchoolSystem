using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Sections.Commands.Create
{
    public class CreateSectionCommandHandler
        : IRequestHandler<CreateSectionCommand, CreateSectionCommandResponse>
    {
        private readonly IGenericRepository<Section> _repo;
        private readonly IMapper _mapper;

        public CreateSectionCommandHandler(IGenericRepository<Section> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<CreateSectionCommandResponse> Handle(CreateSectionCommand request, CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<Section>(request.Section);
            entity.Oid = Guid.NewGuid();
            entity.CreatedAt = DateTime.UtcNow;

            await _repo.CreateAsync(entity);

            return new CreateSectionCommandResponse
            {
                Oid = entity.Oid
            };
        }
    }
}