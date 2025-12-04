using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SchoolSystem.Domain.Entities;
using System;

namespace YourNamespace.Data
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
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<ExamResult> ExamResults { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<FeeInvoice> FeeInvoices { get; set; }
        public DbSet<FeePayment> FeePayments { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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

                entity.HasOne(s => s.Teacher)
                      .WithMany(t => t.Subjects)
                      .HasForeignKey(s => s.TeacherOid)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // -------------------------
            // Attendance
            // -------------------------
            modelBuilder.Entity<Attendance>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.HasOne(a => a.Student)
                      .WithMany(s => s.AttendanceRecords)
                      .HasForeignKey(a => a.StudentOid)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // -------------------------
            // Exam
            // -------------------------
            modelBuilder.Entity<Exam>(entity =>
            {
                entity.HasKey(e => e.Oid);
            });

            // -------------------------
            // ExamResult
            // -------------------------
            modelBuilder.Entity<ExamResult>(entity =>
            {
                entity.HasKey(e => e.Oid);

                entity.HasOne(er => er.Exam)
                      .WithMany(e => e.Results)
                      .HasForeignKey(er => er.ExamOid)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(er => er.Student)
                      .WithMany(s => s.ExamResults)
                      .HasForeignKey(er => er.StudentOid)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(er => er.Subject)
                      .WithMany()
                      .HasForeignKey(er => er.SubjectOid)
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
