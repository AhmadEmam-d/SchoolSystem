using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SchoolSystem.Application.Features.UserProfile.Queries;
using SchoolSystem.Application.Mappings;
// Add these new usings
using SchoolSystem.Application.Features.Settings.Queries.Get;
using SchoolSystem.Application.Features.Students.Commands.Create;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using SchoolSystem.Infrastructure.Services;
using SchoolSystem.Persistence.Contexts;
using SchoolSystem.Persistence.Repositories.Common;
using System.Text;

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
// Add specific Settings mapping profile
builder.Services.AddAutoMapper(typeof(SettingsMappingProfile));

// ===========================
// 🔹 MEDIATR
// ===========================
builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(CreateStudentCommandHandler).Assembly);
    // Register Settings handlers
    cfg.RegisterServicesFromAssembly(typeof(GetSettingsQueryHandler).Assembly);
    cfg.RegisterServicesFromAssembly(typeof(GetUserProfileQueryHandler).Assembly);

});

// ===========================
// 🔹 CUSTOM SERVICES
// ===========================
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddHttpContextAccessor();

// ===========================
// 🔹 SETTINGS SERVICES (NEW)
// ===========================
builder.Services.AddScoped<IBackupService, BackupService>();
builder.Services.AddScoped<IHealthCheckService, HealthCheckService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuditService, AuditService>();

// ===========================
// 🔹 MEMORY CACHE FOR SETTINGS
// ===========================
builder.Services.AddMemoryCache();

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
    // Add System Administrator policy
    options.AddPolicy("SystemAdminOnly", policy => policy.RequireRole(nameof(UserRole.Admin)));
});

// ===========================
// 🔹 CORS POLICY
// ===========================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
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
app.UseCors("AllowAll");

// ===========================
// 🔹 CONFIGURE PIPELINE
// ===========================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

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
        await SeedDefaultSettingsAsync(services); // Add this line
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

// ===========================
// 🔹 SEED DEFAULT SETTINGS (NEW)
// ===========================
static async Task SeedDefaultSettingsAsync(IServiceProvider services)
{
    try
    {
        using var scope = services.CreateScope();
        var settingRepo = scope.ServiceProvider.GetRequiredService<IGenericRepository<Setting>>();
        var auditLogRepo = scope.ServiceProvider.GetRequiredService<IGenericRepository<AuditLog>>();


        var settingsExist = await settingRepo.GetAllQueryable().AnyAsync();

        if (!settingsExist)
        {
            var defaultSettings = new List<Setting>
            {
                // General - Notifications
                new() { Oid = Guid.NewGuid(), Category = "General", Key = "Notifications.EmailNotifications", Value = "true", DataType = "bool", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "General", Key = "Notifications.PushNotifications", Value = "true", DataType = "bool", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "General", Key = "Notifications.AttendanceReminders", Value = "true", DataType = "bool", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "General", Key = "Notifications.GradeUpdates", Value = "true", DataType = "bool", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                
                // General - Security
                new() { Oid = Guid.NewGuid(), Category = "General", Key = "Security.TwoFactorAuth", Value = "false", DataType = "bool", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "General", Key = "Security.SessionTimeout", Value = "30", DataType = "int", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                
                // School Info
                new() { Oid = Guid.NewGuid(), Category = "SchoolInfo", Key = "SchoolName", Value = "School Management System", DataType = "string", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "SchoolInfo", Key = "SchoolAddress", Value = "123 Education Street", DataType = "string", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "SchoolInfo", Key = "SchoolPhone", Value = "+1 234 567 8900", DataType = "string", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "SchoolInfo", Key = "SchoolEmail", Value = "info@school.com", DataType = "string", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "SchoolInfo", Key = "PrincipalName", Value = "Dr. John Smith", DataType = "string", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "SchoolInfo", Key = "EstablishedYear", Value = "2024", DataType = "string", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                
                // Appearance
                new() { Oid = Guid.NewGuid(), Category = "Appearance", Key = "Theme", Value = "Light", DataType = "string", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "Appearance", Key = "CompactMode", Value = "false", DataType = "bool", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "Appearance", Key = "PrimaryColor", Value = "#1976d2", DataType = "string", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "Appearance", Key = "RtlMode", Value = "false", DataType = "bool", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                
                // Language
                new() { Oid = Guid.NewGuid(), Category = "Language", Key = "DefaultLanguage", Value = "en", DataType = "string", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "Language", Key = "DateFormat", Value = "MM/dd/yyyy", DataType = "string", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "Language", Key = "Timezone", Value = "UTC", DataType = "string", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                
                // System
                new() { Oid = Guid.NewGuid(), Category = "System", Key = "Backup.AutoBackup", Value = "true", DataType = "bool", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "System", Key = "Backup.Frequency", Value = "Daily", DataType = "string", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new() { Oid = Guid.NewGuid(), Category = "System", Key = "Backup.RetentionDays", Value = "30", DataType = "int", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            };

            foreach (var setting in defaultSettings)
            {
                await settingRepo.AddAsync(setting);
            }

            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Default settings seeded successfully");
        }
        // Seed AuditLogs (جديد)
        var logsExist = await auditLogRepo.GetAllQueryable().AnyAsync();
        if (!logsExist)
        {
            var defaultLogs = new List<AuditLog>
            {
                new() {
                    Oid = Guid.NewGuid(),
                    Action = "Login",
                    Entity = "User",
                    PerformedBy = "admin@school.com",
                    PerformedAt = DateTime.UtcNow.AddHours(-1),
                    IpAddress = "192.168.1.1",
                    CreatedAt = DateTime.UtcNow
                },
                new() {
                    Oid = Guid.NewGuid(),
                    Action = "UpdateProfile",
                    Entity = "Profile",
                    PerformedBy = "admin@school.com",
                    PerformedAt = DateTime.UtcNow.AddDays(-1),
                    IpAddress = "192.168.1.1",
                    CreatedAt = DateTime.UtcNow
                },
                new() {
                    Oid = Guid.NewGuid(),
                    Action = "UpdateSettings",
                    Entity = "Settings",
                    PerformedBy = "admin@school.com",
                    PerformedAt = DateTime.UtcNow.AddDays(-2),
                    IpAddress = "192.168.1.1",
                    CreatedAt = DateTime.UtcNow
                }
            };

            foreach (var log in defaultLogs)
            {
                await auditLogRepo.AddAsync(log);
            }

            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Default audit logs seeded successfully");
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error seeding default settings");
    }
}