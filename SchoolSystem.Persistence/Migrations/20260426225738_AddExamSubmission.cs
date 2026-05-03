using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddExamSubmission : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ExamSubmissions",
                columns: table => new
                {
                    Oid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExamOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnswerText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AttachmentUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: true),
                    Feedback = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GradedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    GradedByOid = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamSubmissions", x => x.Oid);
                    table.ForeignKey(
                        name: "FK_ExamSubmissions_Exams_ExamOid",
                        column: x => x.ExamOid,
                        principalTable: "Exams",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExamSubmissions_Students_StudentOid",
                        column: x => x.StudentOid,
                        principalTable: "Students",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExamSubmissions_ExamOid",
                table: "ExamSubmissions",
                column: "ExamOid");

            migrationBuilder.CreateIndex(
                name: "IX_ExamSubmissions_StudentOid",
                table: "ExamSubmissions",
                column: "StudentOid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExamSubmissions");
        }
    }
}
