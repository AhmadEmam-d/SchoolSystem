using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUserEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Oid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Avatar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StudentOid = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    TeacherOid = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ParentOid = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Oid);
                    table.ForeignKey(
                        name: "FK_Users_Parents_ParentOid",
                        column: x => x.ParentOid,
                        principalTable: "Parents",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Users_Students_StudentOid",
                        column: x => x.StudentOid,
                        principalTable: "Students",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Users_Teachers_TeacherOid",
                        column: x => x.TeacherOid,
                        principalTable: "Teachers",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
