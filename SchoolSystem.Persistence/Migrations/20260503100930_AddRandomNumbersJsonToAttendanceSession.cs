using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddRandomNumbersJsonToAttendanceSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RandomNumbersJson",
                table: "AttendanceSessions",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RandomNumbersJson",
                table: "AttendanceSessions");
        }
    }
}
