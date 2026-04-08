using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddLessonsTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    Oid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Duration = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    ClassOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeacherOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubjectOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.Oid);
                    table.ForeignKey(
                        name: "FK_Lessons_Classes_ClassOid",
                        column: x => x.ClassOid,
                        principalTable: "Classes",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Lessons_Subjects_SubjectOid",
                        column: x => x.SubjectOid,
                        principalTable: "Subjects",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Lessons_Teachers_TeacherOid",
                        column: x => x.TeacherOid,
                        principalTable: "Teachers",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LessonHomeworks",
                columns: table => new
                {
                    Oid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Attachments = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LessonOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LessonHomeworks", x => x.Oid);
                    table.ForeignKey(
                        name: "FK_LessonHomeworks_Lessons_LessonOid",
                        column: x => x.LessonOid,
                        principalTable: "Lessons",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LessonMaterials",
                columns: table => new
                {
                    Oid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    FileUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    LessonOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LessonMaterials", x => x.Oid);
                    table.ForeignKey(
                        name: "FK_LessonMaterials_Lessons_LessonOid",
                        column: x => x.LessonOid,
                        principalTable: "Lessons",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LessonObjectives",
                columns: table => new
                {
                    Oid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    LessonOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LessonObjectives", x => x.Oid);
                    table.ForeignKey(
                        name: "FK_LessonObjectives_Lessons_LessonOid",
                        column: x => x.LessonOid,
                        principalTable: "Lessons",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LessonHomeworks_LessonOid",
                table: "LessonHomeworks",
                column: "LessonOid");

            migrationBuilder.CreateIndex(
                name: "IX_LessonMaterials_LessonOid",
                table: "LessonMaterials",
                column: "LessonOid");

            migrationBuilder.CreateIndex(
                name: "IX_LessonObjectives_LessonOid",
                table: "LessonObjectives",
                column: "LessonOid");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_ClassOid",
                table: "Lessons",
                column: "ClassOid");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_Date",
                table: "Lessons",
                column: "Date");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_Status",
                table: "Lessons",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_SubjectOid",
                table: "Lessons",
                column: "SubjectOid");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_TeacherOid",
                table: "Lessons",
                column: "TeacherOid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LessonHomeworks");

            migrationBuilder.DropTable(
                name: "LessonMaterials");

            migrationBuilder.DropTable(
                name: "LessonObjectives");

            migrationBuilder.DropTable(
                name: "Lessons");
        }
    }
}
