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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Oid);
                entity.HasIndex(e => e.Email).IsUnique();

                entity.Property(e => e.Avatar)
                      .IsRequired(false); // ✅ يسمح بـ NULL

                entity.Property(e => e.PasswordHash)
                      .HasMaxLength(500)
                      .IsRequired();

                entity.HasOne(e => e.Student)
                      .WithOne()
                      .HasForeignKey<User>(e => e.StudentOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Teacher)
                      .WithOne()
                      .HasForeignKey<User>(e => e.TeacherOid)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Parent)
                      .WithOne()
                      .HasForeignKey<User>(e => e.ParentOid)
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
            });

            // -------------------------
            // Teacher
            // -------------------------
            modelBuilder.Entity<Teacher>(entity =>
            {
                entity.HasKey(e => e.Oid);
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
            });

            // -------------------------
            // Notification
            // -------------------------
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.Oid);
            });
        }
    }
}