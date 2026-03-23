using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddTeacherOidAndDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Classes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "TeacherOid",
                table: "Classes",
                type: "uniqueidentifier",
                nullable: true);

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classes_Teachers_TeacherOid",
                table: "Classes");

            migrationBuilder.DropIndex(
                name: "IX_Classes_TeacherOid",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "TeacherOid",
                table: "Classes");
        }
    }
}
