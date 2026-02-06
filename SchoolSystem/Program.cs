using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Interfaces.Common;
using SchoolSystem.Infrastructure.Services;
using SchoolSystem.Persistence;
using SchoolSystem.Persistence.Repositories.Common;
using System.Reflection;
using YourNamespace.Data;

var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Generic repository
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// AutoMapper (optional if using DTO mapping)
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// MediatR - scan multiple assemblies
builder.Services.AddMediatR(typeof(CreateStudentCommandHandler).Assembly);

builder.Services.AddScoped<IMessageService, MessageService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
