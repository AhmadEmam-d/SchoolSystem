using Microsoft.EntityFrameworkCore;
using SchoolSystem.Domain.Entities;

namespace SchoolSystem.Persistence.Contexts
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // DbSets
        public DbSet<Student> Students { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<TeacherSubject> TeacherSubjects { get; set; }
        public DbSet<SchoolSystem.Domain.Entities.Attendance> Attendances { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<ExamResult> ExamResults { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<FeeInvoice> FeeInvoices { get; set; }
        public DbSet<FeePayment> FeePayments { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Timetable> Timetables { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<StudentReport> StudentReports { get; set; }
        public DbSet<TeacherReport> TeacherReports { get; set; }
        public DbSet<FinancialReport> FinancialReports { get; set; }
        public DbSet<Setting> Settings { get; set; }
        public DbSet<SystemBackup> SystemBackups { get; set; }
        public DbSet<UserPreference> UserPreferences { get; set; }
        public DbSet<EmailConfiguration> EmailConfigurations { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<LessonObjective> LessonObjectives { get; set; }
        public DbSet<LessonMaterial> LessonMaterials { get; set; }
        public DbSet<LessonHomework> LessonHomeworks { get; set; }
        public DbSet<SmartTutorConversation> SmartTutorConversations { get; set; }
        public DbSet<SupportTicket> SupportTickets { get; set; }
        public DbSet<FAQ> FAQs { get; set; }
        public DbSet<KnowledgeBaseArticle> KnowledgeBaseArticles { get; set; }
        public DbSet<AttendanceSession> AttendanceSessions { get; set; }
        public DbSet<Homework> Homeworks { get; set; }
        public DbSet<HomeworkAttachment> HomeworkAttachments { get; set; }
        public DbSet<HomeworkSubmission> HomeworkSubmissions { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.HasIndex(e => e.Email).IsUnique();

                entity.Property(e => e.Avatar)
                      .IsRequired(false); 

                entity.Property(e => e.PasswordHash)
                      .HasMaxLength(500)
                      .IsRequired();

                entity.HasOne(e => e.Student)
                      .WithOne(s => s.User) 
                      .HasForeignKey<Student>(s => s.UserId)  
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Teacher)
                      .WithOne(t => t.User)  
                      .HasForeignKey<Teacher>(t => t.UserId)  
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Parent)
                      .WithOne(p => p.User) 
                      .HasForeignKey<Parent>(p => p.UserId)  
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.Role)
                      .HasConversion<string>();
            });
            // -------------------------
            // Student
            // -------------------------
            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.HasOne(e => e.Class)
                      .WithMany(c => c.Students)
                      .HasForeignKey(e => e.ClassOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Section)
                      .WithMany(s => s.Students)
                      .HasForeignKey(e => e.SectionOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Parent)
                      .WithMany(p => p.Students)
                      .HasForeignKey(e => e.ParentOid)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(s => s.User)
                      .WithOne(u => u.Student)
                      .HasForeignKey<Student>(s => s.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
            // -------------------------
            // Announcement
            // -------------------------
            modelBuilder.Entity<Announcement>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.Property(e => e.Target).HasConversion<int>();
                entity.Property(e => e.Priority).HasConversion<int>();
                entity.HasIndex(e => e.PublishDate);
                entity.HasIndex(e => e.IsPublished);
                entity.HasIndex(e => e.IsActive);
            });
            // -------------------------
            // Timetable
            // -------------------------
            modelBuilder.Entity<SchoolSystem.Domain.Entities.Timetable>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.HasOne(e => e.Class)
                      .WithMany(c => c.Timetables)
                      .HasForeignKey(e => e.ClassOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Subject)
                      .WithMany()
                      .HasForeignKey(e => e.SubjectOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Teacher)
                      .WithMany(t => t.Timetables)
                      .HasForeignKey(e => e.TeacherOid)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // -------------------------
            // Parent
            // -------------------------
            modelBuilder.Entity<Parent>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.HasOne(p => p.User)
                 .WithOne(u => u.Parent)
                 .HasForeignKey<Parent>(p => p.UserId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // -------------------------
            // Teacher
            // -------------------------
            modelBuilder.Entity<Teacher>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.HasOne(s => s.User)
                  .WithOne(u => u.Teacher)
                  .HasForeignKey<Teacher>(s => s.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
            });

            // -------------------------
            // Class
            // -------------------------
            modelBuilder.Entity<Class>(entity =>
            {
                entity.HasKey(e => e.Oid);
            });

            // -------------------------
            // Section
            // -------------------------
            modelBuilder.Entity<Section>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.HasOne(s => s.Class)
                      .WithMany(c => c.Sections)
                      .HasForeignKey(s => s.ClassOid)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // -------------------------
            // Subject
            // -------------------------
            modelBuilder.Entity<Subject>(entity =>
            {
                entity.HasKey(e => e.Oid);
            });

            // -------------------------
            // TeacherSubject (Many-to-Many)
            // -------------------------
            modelBuilder.Entity<TeacherSubject>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.HasOne(ts => ts.Teacher)
                      .WithMany(t => t.TeacherSubjects)
                      .HasForeignKey(ts => ts.TeacherOid)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ts => ts.Subject)
                      .WithMany(s => s.TeacherSubjects)
                      .HasForeignKey(ts => ts.SubjectOid)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // -------------------------
            // Attendance
            // -------------------------
            modelBuilder.Entity<SchoolSystem.Domain.Entities.Attendance>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.HasOne(e => e.Student)
                      .WithMany(s => s.AttendanceRecords)
                      .HasForeignKey(e => e.StudentOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Class)
                      .WithMany()
                      .HasForeignKey(e => e.ClassOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => new { e.StudentOid, e.Date }).IsUnique();
            });

            // -------------------------
            // Exam
            // -------------------------
            modelBuilder.Entity<Exam>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.HasOne(e => e.Subject)
                      .WithMany()
                      .HasForeignKey(e => e.SubjectOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Class)
                      .WithMany()
                      .HasForeignKey(e => e.ClassOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.Type).HasConversion<int>();
                entity.Property(e => e.Status).HasConversion<int>();
            });
            // -------------------------
            // Report
            // -------------------------
            modelBuilder.Entity<Report>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.Property(e => e.Data).HasColumnType("nvarchar(max)");
                entity.Property(e => e.Parameters).HasColumnType("nvarchar(max)");
                entity.HasIndex(e => e.GeneratedAt);
                entity.HasIndex(e => e.Type);
                entity.HasIndex(e => e.IsArchived);
            });
            // -------------------------
            // StudentReport
            // -------------------------
            modelBuilder.Entity<StudentReport>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.HasOne(e => e.Student)
                      .WithMany()
                      .HasForeignKey(e => e.StudentOid)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasIndex(e => e.GeneratedAt);
                entity.HasIndex(e => e.ReportType);
            });

            // -------------------------
            // TeacherReport
            // -------------------------
            modelBuilder.Entity<TeacherReport>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.HasOne(e => e.Teacher)
                      .WithMany()
                      .HasForeignKey(e => e.TeacherOid)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasIndex(e => e.GeneratedAt);
                entity.HasIndex(e => e.ReportType);
            });
            // -------------------------
            // FinancialReport
            // -------------------------
            modelBuilder.Entity<FinancialReport>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.Property(e => e.Details).HasColumnType("nvarchar(max)");
                entity.HasIndex(e => e.GeneratedAt);
                entity.HasIndex(e => e.Period);
            });
            // -------------------------
            // ExamResult
            // -------------------------
            modelBuilder.Entity<ExamResult>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.HasOne(e => e.Exam)
                      .WithMany(e => e.Results)
                      .HasForeignKey(e => e.ExamOid)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Student)
                      .WithMany(s => s.ExamResults)
                      .HasForeignKey(e => e.StudentOid)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // -------------------------
            // Assignment
            // -------------------------
            modelBuilder.Entity<Assignment>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.HasOne(a => a.Subject)
                      .WithMany()
                      .HasForeignKey(a => a.SubjectOid)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // -------------------------
            // FeeInvoice
            // -------------------------
            modelBuilder.Entity<FeeInvoice>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.HasOne(f => f.Student)
                      .WithMany(s => s.FeeInvoices)
                      .HasForeignKey(f => f.StudentOid)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // -------------------------
            // FeePayment
            // -------------------------
            modelBuilder.Entity<FeePayment>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.HasOne(p => p.FeeInvoice)
                      .WithMany(f => f.Payments)
                      .HasForeignKey(p => p.FeeInvoiceOid)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // -------------------------
            // Event
            // -------------------------
            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasKey(e => e.Oid);
            });

            // -------------------------
            // Message
            // -------------------------
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.HasIndex(e => e.SenderOid);
                entity.HasIndex(e => e.ReceiverOid);
                entity.HasIndex(e => e.SentAt);
                entity.HasIndex(e => e.IsRead);

                
            });

            // -------------------------
            // Notification
            // -------------------------
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.HasIndex(e => e.UserOid);
                entity.HasIndex(e => e.TargetRole);
                entity.HasIndex(e => e.IsRead);
                entity.HasIndex(e => e.SentAt);
                entity.HasIndex(e => e.Type);
                entity.HasIndex(e => e.Priority);
            });
            // Settings unique constraint
            modelBuilder.Entity<Setting>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.HasIndex(e => new { e.Category, e.Key }).IsUnique();
            });

            modelBuilder.Entity<SystemBackup>(entity =>
            {
                entity.HasKey(e => e.Oid);
            });

            modelBuilder.Entity<UserPreference>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.HasIndex(e => new { e.UserId, e.PreferenceKey }).IsUnique();
            });

            modelBuilder.Entity<EmailConfiguration>(entity =>
            {
                entity.HasKey(e => e.Oid);
            });

            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasKey(e => e.Oid);
            });
            // Lesson Configuration
            modelBuilder.Entity<Lesson>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Title)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(e => e.Description)
                      .HasMaxLength(2000);

                entity.HasIndex(e => e.Date);
                entity.HasIndex(e => e.Status);

                // Relationships
                entity.HasOne(e => e.Class)
                      .WithMany()
                      .HasForeignKey(e => e.ClassOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Subject)
                      .WithMany()
                      .HasForeignKey(e => e.SubjectOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Teacher)
                      .WithMany(t => t.Lessons)
                      .HasForeignKey(e => e.TeacherOid)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // LessonObjective Configuration
            modelBuilder.Entity<LessonObjective>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Description)
                      .IsRequired()
                      .HasMaxLength(500);

                entity.HasOne(e => e.Lesson)
                      .WithMany(l => l.Objectives)
                      .HasForeignKey(e => e.LessonOid)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // LessonMaterial Configuration
            modelBuilder.Entity<LessonMaterial>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Name)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(e => e.FileUrl)
                      .HasMaxLength(500);

                entity.Property(e => e.FileType)
                      .HasMaxLength(50);

                entity.HasOne(e => e.Lesson)
                      .WithMany(l => l.Materials)
                      .HasForeignKey(e => e.LessonOid)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // LessonHomework Configuration
            modelBuilder.Entity<LessonHomework>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Title)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(e => e.Description)
                      .HasMaxLength(1000);

                entity.HasOne(e => e.Lesson)
                      .WithMany(l => l.Homeworks)
                      .HasForeignKey(e => e.LessonOid)
                      .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<SmartTutorConversation>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.ConversationId)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.UserRole)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(e => e.Question).IsRequired();
                entity.Property(e => e.Answer).IsRequired();

                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.ConversationId);
                entity.HasIndex(e => e.Timestamp);

                entity.HasOne(e => e.User)
                      .WithMany() 
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
            // ===========================
            // SupportTicket Configuration
            // ===========================
            modelBuilder.Entity<SupportTicket>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.Property(e => e.Subject).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Message).IsRequired();
                entity.Property(e => e.UserRole).HasMaxLength(50);
                entity.Property(e => e.Status).HasConversion<int>();
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.CreatedAt);

                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ===========================
            // FAQ Configuration
            // ===========================
            modelBuilder.Entity<FAQ>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.Property(e => e.Question).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Answer).IsRequired();
                entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Order);
                entity.Property(e => e.IsPublished);
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.Order);
                entity.HasIndex(e => e.IsPublished);
            });

            // ===========================
            // KnowledgeBaseArticle Configuration
            // ===========================
            modelBuilder.Entity<KnowledgeBaseArticle>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
                entity.Property(e => e.VideoUrl).HasMaxLength(500);
                entity.Property(e => e.DocumentUrl).HasMaxLength(500);
                entity.Property(e => e.ViewCount);
                entity.Property(e => e.IsPublished);
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.IsPublished);
                entity.HasIndex(e => e.ViewCount);
            });
            modelBuilder.Entity<AttendanceSession>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Method)
                      .IsRequired();

                entity.HasOne(e => e.Class)
                      .WithMany()
                      .HasForeignKey(e => e.ClassOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Teacher)
                      .WithMany()
                      .HasForeignKey(e => e.TeacherId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
            // ===========================
            // Homework Configuration
            // ===========================
            modelBuilder.Entity<Homework>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Title)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(e => e.Description)
                      .IsRequired()
                      .HasMaxLength(2000);

                entity.Property(e => e.Instructions)
                      .HasMaxLength(2000);

                entity.Property(e => e.TotalMarks)
                      .HasPrecision(18, 2);

                entity.Property(e => e.SubmissionType)
                      .HasMaxLength(50);

                entity.Property(e => e.Status)
                      .HasConversion<int>();

                entity.HasIndex(e => e.DueDate);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.TeacherOid);
                entity.HasIndex(e => e.ClassOid);
                entity.HasIndex(e => e.SubjectOid);

                // Relationships
                entity.HasOne(e => e.Teacher)
                      .WithMany(t => t.Homeworks)
                      .HasForeignKey(e => e.TeacherOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Class)
                      .WithMany(c => c.Homeworks)
                      .HasForeignKey(e => e.ClassOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Subject)
                      .WithMany()
                      .HasForeignKey(e => e.SubjectOid)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ===========================
            // HomeworkAttachment Configuration
            // ===========================
            modelBuilder.Entity<HomeworkAttachment>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.FileName)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(e => e.FileUrl)
                      .IsRequired()
                      .HasMaxLength(500);

                entity.Property(e => e.FileType)
                      .HasMaxLength(50);

                entity.HasOne(e => e.Homework)
                      .WithMany(h => h.Attachments)
                      .HasForeignKey(e => e.HomeworkOid)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ===========================
            // HomeworkSubmission Configuration
            // ===========================
            modelBuilder.Entity<HomeworkSubmission>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.Property(e => e.Content)
                      .HasMaxLength(4000);

                entity.Property(e => e.AttachmentUrl)
                      .HasMaxLength(500);

                entity.Property(e => e.Feedback)
                      .HasMaxLength(1000);

                entity.Property(e => e.Status)
                      .HasConversion<int>();

                entity.Property(e => e.Grade)
                      .HasPrecision(18, 2);

                entity.HasIndex(e => e.HomeworkOid);
                entity.HasIndex(e => e.StudentOid);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.SubmittedAt);

                entity.HasOne(e => e.Homework)
                      .WithMany(h => h.Submissions)
                      .HasForeignKey(e => e.HomeworkOid)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Student)
                      .WithMany(s => s.Submissions)
                      .HasForeignKey(e => e.StudentOid)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}