using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAttendace : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Students_StudentOid",
                table: "Attendances");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_StudentOid",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "IsPresent",
                table: "Attendances");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "CheckInTime",
                table: "Attendances",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "CheckOutTime",
                table: "Attendances",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ClassOid",
                table: "Attendances",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "Attendances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Attendances",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_ClassOid",
                table: "Attendances",
                column: "ClassOid");

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_StudentOid_Date",
                table: "Attendances",
                columns: new[] { "StudentOid", "Date" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Classes_ClassOid",
                table: "Attendances",
                column: "ClassOid",
                principalTable: "Classes",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Students_StudentOid",
                table: "Attendances",
                column: "StudentOid",
                principalTable: "Students",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Classes_ClassOid",
                table: "Attendances");

            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_Students_StudentOid",
                table: "Attendances");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_ClassOid",
                table: "Attendances");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_StudentOid_Date",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "CheckInTime",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "CheckOutTime",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "ClassOid",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Attendances");

            migrationBuilder.AddColumn<bool>(
                name: "IsPresent",
                table: "Attendances",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_StudentOid",
                table: "Attendances",
                column: "StudentOid");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_Students_StudentOid",
                table: "Attendances",
                column: "StudentOid",
                principalTable: "Students",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
