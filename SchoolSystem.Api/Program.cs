using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SchoolSystem.Application.Features.Students.Commands.Create;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using SchoolSystem.Infrastructure.Services;
using SchoolSystem.Persistence.Repositories.Common;
using System.Text;
using SchoolSystem.Persistence.Contexts;

var builder = WebApplication.CreateBuilder(args);

// ===========================
// 🔹 DATABASE CONTEXT
// ===========================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("SchoolSystem.Persistence") 
    )
);

// ===========================
// 🔹 REPOSITORIES
// ===========================
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// ===========================
// 🔹 AUTOMAPPER
// ===========================
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// ===========================
// 🔹 MEDIATR
// ===========================
builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(CreateStudentCommandHandler).Assembly);
});

// ===========================
// 🔹 CUSTOM SERVICES
// ===========================
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddHttpContextAccessor();

// ===========================
// 🔹 JWT AUTHENTICATION
// ===========================
var jwtSettings = builder.Configuration.GetSection("JWT");
var secretKey = jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret is not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["ValidIssuer"],
        ValidAudience = jwtSettings["ValidAudience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// ===========================
// 🔹 AUTHORIZATION POLICIES
// ===========================
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole(nameof(UserRole.Admin)));
    options.AddPolicy("TeacherOnly", policy => policy.RequireRole(nameof(UserRole.Teacher)));
    options.AddPolicy("StudentOnly", policy => policy.RequireRole(nameof(UserRole.Student)));
    options.AddPolicy("ParentOnly", policy => policy.RequireRole(nameof(UserRole.Parent)));
    options.AddPolicy("StaffOnly", policy => policy.RequireRole(nameof(UserRole.Admin), nameof(UserRole.Teacher)));
    options.AddPolicy("AllUsers", policy => policy.RequireRole(
        nameof(UserRole.Admin),
        nameof(UserRole.Teacher),
        nameof(UserRole.Student),
        nameof(UserRole.Parent)));
});

// ===========================
// 🔹 CORS POLICY
// ===========================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()      // يسمح لأي مصدر (للتطوير فقط)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ===========================
// 🔹 CONTROLLERS WITH JSON OPTIONS
// ===========================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// ===========================
// 🔹 SWAGGER WITH JWT SUPPORT
// ===========================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SchoolSystem API",
        Version = "v1",
        Description = "API for School Management System"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ===========================
// 🔹 CONFIGURE PIPELINE
// ===========================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ===========================
// 🔹 DATABASE INITIALIZATION & SEEDING
// ===========================
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        await context.Database.EnsureCreatedAsync();
        await SeedDefaultAdminAsync(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during database initialization");
    }
}

app.Run();

// ===========================
// 🔹 SEED METHODS
// ===========================
static async Task SeedDefaultAdminAsync(IServiceProvider services)
{
    try
    {
        using var scope = services.CreateScope();
        var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
        var userRepo = scope.ServiceProvider.GetRequiredService<IGenericRepository<User>>();

        var adminExists = await userRepo.GetAllQueryable()
            .AnyAsync(u => u.Role == UserRole.Admin);

        if (!adminExists)
        {
            var registerDto = new SchoolSystem.Application.Features.Auth.DTOs.RegisterDto
            {
                FullName = "System Administrator",
                Email = "admin@school.com",
                Password = "Admin@123",
                ConfirmPassword = "Admin@123",
                PhoneNumber = "01234567890",
                Role = UserRole.Admin
            };

            await authService.RegisterAsync(registerDto);

            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Default admin user created successfully");
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error seeding admin user");
    }
}