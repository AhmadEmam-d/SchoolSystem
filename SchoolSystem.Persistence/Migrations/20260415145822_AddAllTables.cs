using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAllTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ClassOid1",
                table: "AttendanceSessions",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TeacherOid",
                table: "AttendanceSessions",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Homeworks",
                columns: table => new
                {
                    Oid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Instructions = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AssignedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalMarks = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    SubmissionType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AllowLateSubmissions = table.Column<bool>(type: "bit", nullable: false),
                    NotifyParents = table.Column<bool>(type: "bit", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    TeacherOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClassOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubjectOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Homeworks", x => x.Oid);
                    table.ForeignKey(
                        name: "FK_Homeworks_Classes_ClassOid",
                        column: x => x.ClassOid,
                        principalTable: "Classes",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Homeworks_Subjects_SubjectOid",
                        column: x => x.SubjectOid,
                        principalTable: "Subjects",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Homeworks_Teachers_TeacherOid",
                        column: x => x.TeacherOid,
                        principalTable: "Teachers",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HomeworkAttachments",
                columns: table => new
                {
                    Oid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    FileUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    HomeworkOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeworkAttachments", x => x.Oid);
                    table.ForeignKey(
                        name: "FK_HomeworkAttachments_Homeworks_HomeworkOid",
                        column: x => x.HomeworkOid,
                        principalTable: "Homeworks",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HomeworkSubmissions",
                columns: table => new
                {
                    Oid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    AttachmentUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Grade = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    Feedback = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    GradedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    HomeworkOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeworkSubmissions", x => x.Oid);
                    table.ForeignKey(
                        name: "FK_HomeworkSubmissions_Homeworks_HomeworkOid",
                        column: x => x.HomeworkOid,
                        principalTable: "Homeworks",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HomeworkSubmissions_Students_StudentOid",
                        column: x => x.StudentOid,
                        principalTable: "Students",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceSessions_ClassOid1",
                table: "AttendanceSessions",
                column: "ClassOid1");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceSessions_TeacherOid",
                table: "AttendanceSessions",
                column: "TeacherOid");

            migrationBuilder.CreateIndex(
                name: "IX_HomeworkAttachments_HomeworkOid",
                table: "HomeworkAttachments",
                column: "HomeworkOid");

            migrationBuilder.CreateIndex(
                name: "IX_Homeworks_ClassOid",
                table: "Homeworks",
                column: "ClassOid");

            migrationBuilder.CreateIndex(
                name: "IX_Homeworks_DueDate",
                table: "Homeworks",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_Homeworks_Status",
                table: "Homeworks",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Homeworks_SubjectOid",
                table: "Homeworks",
                column: "SubjectOid");

            migrationBuilder.CreateIndex(
                name: "IX_Homeworks_TeacherOid",
                table: "Homeworks",
                column: "TeacherOid");

            migrationBuilder.CreateIndex(
                name: "IX_HomeworkSubmissions_HomeworkOid",
                table: "HomeworkSubmissions",
                column: "HomeworkOid");

            migrationBuilder.CreateIndex(
                name: "IX_HomeworkSubmissions_Status",
                table: "HomeworkSubmissions",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_HomeworkSubmissions_StudentOid",
                table: "HomeworkSubmissions",
                column: "StudentOid");

            migrationBuilder.CreateIndex(
                name: "IX_HomeworkSubmissions_SubmittedAt",
                table: "HomeworkSubmissions",
                column: "SubmittedAt");

            migrationBuilder.AddForeignKey(
                name: "FK_AttendanceSessions_Classes_ClassOid1",
                table: "AttendanceSessions",
                column: "ClassOid1",
                principalTable: "Classes",
                principalColumn: "Oid");

            migrationBuilder.AddForeignKey(
                name: "FK_AttendanceSessions_Teachers_TeacherOid",
                table: "AttendanceSessions",
                column: "TeacherOid",
                principalTable: "Teachers",
                principalColumn: "Oid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AttendanceSessions_Classes_ClassOid1",
                table: "AttendanceSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_AttendanceSessions_Teachers_TeacherOid",
                table: "AttendanceSessions");

            migrationBuilder.DropTable(
                name: "HomeworkAttachments");

            migrationBuilder.DropTable(
                name: "HomeworkSubmissions");

            migrationBuilder.DropTable(
                name: "Homeworks");

            migrationBuilder.DropIndex(
                name: "IX_AttendanceSessions_ClassOid1",
                table: "AttendanceSessions");

            migrationBuilder.DropIndex(
                name: "IX_AttendanceSessions_TeacherOid",
                table: "AttendanceSessions");

            migrationBuilder.DropColumn(
                name: "ClassOid1",
                table: "AttendanceSessions");

            migrationBuilder.DropColumn(
                name: "TeacherOid",
                table: "AttendanceSessions");
        }
    }
}
