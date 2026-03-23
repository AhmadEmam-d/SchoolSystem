using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Subjects.Commands.Update
{
    public class UpdateSubjectCommandHandler : IRequestHandler<UpdateSubjectCommand, UpdateSubjectCommandResponse>
    {
        private readonly IGenericRepository<Subject> _repo;
        private readonly IMapper _mapper;

        public UpdateSubjectCommandHandler(IGenericRepository<Subject> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<UpdateSubjectCommandResponse> Handle(UpdateSubjectCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repo.GetByOidAsync(request.Oid);
            if (entity == null)
                throw new Exception($"Subject with Oid {request.Oid} not found.");

            _mapper.Map(request.Subject, entity);
            await _repo.UpdateAsync(entity);

            return new UpdateSubjectCommandResponse { Oid = entity.Oid };
        }
    }
}