using MediatR;

public record DeleteSubjectCommand(Guid Oid) : IRequest;
