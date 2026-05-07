using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddSessionOidToAttendance_Complete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SessionOid",
                table: "Attendances",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_SessionOid",
                table: "Attendances",
                column: "SessionOid");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_AttendanceSessions_SessionOid",
                table: "Attendances",
                column: "SessionOid",
                principalTable: "AttendanceSessions",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_AttendanceSessions_SessionOid",
                table: "Attendances");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_SessionOid",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "SessionOid",
                table: "Attendances");
        }
    }
}
