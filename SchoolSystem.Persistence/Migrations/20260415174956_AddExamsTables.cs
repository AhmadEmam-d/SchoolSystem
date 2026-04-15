using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddExamsTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TeacherOid",
                table: "Exams",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Exams_TeacherOid",
                table: "Exams",
                column: "TeacherOid");

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Teachers_TeacherOid",
                table: "Exams",
                column: "TeacherOid",
                principalTable: "Teachers",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Teachers_TeacherOid",
                table: "Exams");

            migrationBuilder.DropIndex(
                name: "IX_Exams_TeacherOid",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "TeacherOid",
                table: "Exams");
        }
    }
}
