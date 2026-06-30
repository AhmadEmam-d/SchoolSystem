using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ConvertClassTeacherToManyToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {


            migrationBuilder.DropColumn(
                name: "TeacherOid",
                table: "Classes");

            migrationBuilder.CreateTable(
                name: "ClassTeachers",
                columns: table => new
                {
                    Oid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClassOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeacherOid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassTeachers", x => x.Oid);
                    table.ForeignKey(
                        name: "FK_ClassTeachers_Classes_ClassOid",
                        column: x => x.ClassOid,
                        principalTable: "Classes",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClassTeachers_Teachers_TeacherOid",
                        column: x => x.TeacherOid,
                        principalTable: "Teachers",
                        principalColumn: "Oid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClassTeachers_ClassOid_TeacherOid",
                table: "ClassTeachers",
                columns: new[] { "ClassOid", "TeacherOid" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClassTeachers_TeacherOid",
                table: "ClassTeachers",
                column: "TeacherOid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClassTeachers");

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
    }
}
