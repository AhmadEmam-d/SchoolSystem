using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddTimetableEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Timetables",
                columns: table => new
                {
                    Oid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClassOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubjectOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeacherOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Day = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    Room = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Period = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Timetables", x => x.Oid);
                    table.ForeignKey(
                        name: "FK_Timetables_Classes_ClassOid",
                        column: x => x.ClassOid,
                        principalTable: "Classes",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Timetables_Subjects_SubjectOid",
                        column: x => x.SubjectOid,
                        principalTable: "Subjects",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Timetables_Teachers_TeacherOid",
                        column: x => x.TeacherOid,
                        principalTable: "Teachers",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Timetables_ClassOid",
                table: "Timetables",
                column: "ClassOid");

            migrationBuilder.CreateIndex(
                name: "IX_Timetables_SubjectOid",
                table: "Timetables",
                column: "SubjectOid");

            migrationBuilder.CreateIndex(
                name: "IX_Timetables_TeacherOid",
                table: "Timetables",
                column: "TeacherOid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Timetables");
        }
    }
}
