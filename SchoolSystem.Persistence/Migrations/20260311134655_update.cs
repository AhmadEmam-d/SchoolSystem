using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classes_Teachers_TeacherOid",
                table: "Classes");

            migrationBuilder.DropForeignKey(
                name: "FK_Subjects_Teachers_TeacherOid",
                table: "Subjects");

            migrationBuilder.DropIndex(
                name: "IX_Subjects_TeacherOid",
                table: "Subjects");

            migrationBuilder.DropIndex(
                name: "IX_Classes_TeacherOid",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "TeacherOid",
                table: "Subjects");

            migrationBuilder.DropColumn(
                name: "AdmissionNumber",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "TeacherOid",
                table: "Classes");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Classes",
                newName: "Level");

            migrationBuilder.CreateTable(
                name: "TeacherSubjects",
                columns: table => new
                {
                    Oid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeacherOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubjectOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeacherSubjects", x => x.Oid);
                    table.ForeignKey(
                        name: "FK_TeacherSubjects_Subjects_SubjectOid",
                        column: x => x.SubjectOid,
                        principalTable: "Subjects",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TeacherSubjects_Teachers_TeacherOid",
                        column: x => x.TeacherOid,
                        principalTable: "Teachers",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeacherSubjects_SubjectOid",
                table: "TeacherSubjects",
                column: "SubjectOid");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherSubjects_TeacherOid",
                table: "TeacherSubjects",
                column: "TeacherOid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeacherSubjects");

            migrationBuilder.RenameColumn(
                name: "Level",
                table: "Classes",
                newName: "Description");

            migrationBuilder.AddColumn<Guid>(
                name: "TeacherOid",
                table: "Subjects",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "AdmissionNumber",
                table: "Students",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "TeacherOid",
                table: "Classes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_TeacherOid",
                table: "Subjects",
                column: "TeacherOid");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_TeacherOid",
                table: "Classes",
                column: "TeacherOid");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_Teachers_TeacherOid",
                table: "Classes",
                column: "TeacherOid",
                principalTable: "Teachers",
                principalColumn: "Oid");

            migrationBuilder.AddForeignKey(
                name: "FK_Subjects_Teachers_TeacherOid",
                table: "Subjects",
                column: "TeacherOid",
                principalTable: "Teachers",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
