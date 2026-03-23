using MediatR;
using System;

public record DeleteStudentCommand(Guid Id) : IRequest<Unit>;
