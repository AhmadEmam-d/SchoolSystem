using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixTeacherUserRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Parents_ParentOid",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Students_StudentOid",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Teachers_TeacherOid",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_ParentOid",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_StudentOid",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_TeacherOid",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ParentOid",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "StudentOid",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "TeacherOid",
                table: "Users");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Teachers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Students",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Parents",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Teachers_UserId",
                table: "Teachers",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Students_UserId",
                table: "Students",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Parents_UserId",
                table: "Parents",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Parents_Users_UserId",
                table: "Parents",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Users_UserId",
                table: "Students",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Teachers_Users_UserId",
                table: "Teachers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Parents_Users_UserId",
                table: "Parents");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Users_UserId",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Teachers_Users_UserId",
                table: "Teachers");

            migrationBuilder.DropIndex(
                name: "IX_Teachers_UserId",
                table: "Teachers");

            migrationBuilder.DropIndex(
                name: "IX_Students_UserId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Parents_UserId",
                table: "Parents");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Teachers");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Parents");

            migrationBuilder.AddColumn<Guid>(
                name: "ParentOid",
                table: "Users",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "StudentOid",
                table: "Users",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TeacherOid",
                table: "Users",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_ParentOid",
                table: "Users",
                column: "ParentOid",
                unique: true,
                filter: "[ParentOid] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Users_StudentOid",
                table: "Users",
                column: "StudentOid",
                unique: true,
                filter: "[StudentOid] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Users_TeacherOid",
                table: "Users",
                column: "TeacherOid",
                unique: true,
                filter: "[TeacherOid] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Parents_ParentOid",
                table: "Users",
                column: "ParentOid",
                principalTable: "Parents",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Students_StudentOid",
                table: "Users",
                column: "StudentOid",
                principalTable: "Students",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Teachers_TeacherOid",
                table: "Users",
                column: "TeacherOid",
                principalTable: "Teachers",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
