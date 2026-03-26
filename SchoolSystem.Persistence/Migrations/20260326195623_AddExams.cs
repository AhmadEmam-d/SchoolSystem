using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolSystem.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddExams : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExamResults_Students_StudentOid",
                table: "ExamResults");

            migrationBuilder.DropForeignKey(
                name: "FK_ExamResults_Subjects_SubjectOid",
                table: "ExamResults");

            migrationBuilder.DropIndex(
                name: "IX_ExamResults_SubjectOid",
                table: "ExamResults");

            migrationBuilder.DropColumn(
                name: "Marks",
                table: "ExamResults");

            migrationBuilder.DropColumn(
                name: "SubjectOid",
                table: "ExamResults");

            migrationBuilder.RenameColumn(
                name: "ExamName",
                table: "Exams",
                newName: "Room");

            migrationBuilder.AddColumn<Guid>(
                name: "ClassOid",
                table: "Exams",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Exams",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "Duration",
                table: "Exams",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<string>(
                name: "Instructions",
                table: "Exams",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MaxScore",
                table: "Exams",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Exams",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PassingScore",
                table: "Exams",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "StartTime",
                table: "Exams",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Exams",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "SubjectOid",
                table: "Exams",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Exams",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Grade",
                table: "ExamResults",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "GradedAt",
                table: "ExamResults",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsPassed",
                table: "ExamResults",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Percentage",
                table: "ExamResults",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "ExamResults",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Score",
                table: "ExamResults",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubmittedAt",
                table: "ExamResults",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Exams_ClassOid",
                table: "Exams",
                column: "ClassOid");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_SubjectOid",
                table: "Exams",
                column: "SubjectOid");

            migrationBuilder.AddForeignKey(
                name: "FK_ExamResults_Students_StudentOid",
                table: "ExamResults",
                column: "StudentOid",
                principalTable: "Students",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Classes_ClassOid",
                table: "Exams",
                column: "ClassOid",
                principalTable: "Classes",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Subjects_SubjectOid",
                table: "Exams",
                column: "SubjectOid",
                principalTable: "Subjects",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExamResults_Students_StudentOid",
                table: "ExamResults");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Classes_ClassOid",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Subjects_SubjectOid",
                table: "Exams");

            migrationBuilder.DropIndex(
                name: "IX_Exams_ClassOid",
                table: "Exams");

            migrationBuilder.DropIndex(
                name: "IX_Exams_SubjectOid",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "ClassOid",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "Instructions",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "MaxScore",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "PassingScore",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "SubjectOid",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "Grade",
                table: "ExamResults");

            migrationBuilder.DropColumn(
                name: "GradedAt",
                table: "ExamResults");

            migrationBuilder.DropColumn(
                name: "IsPassed",
                table: "ExamResults");

            migrationBuilder.DropColumn(
                name: "Percentage",
                table: "ExamResults");

            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "ExamResults");

            migrationBuilder.DropColumn(
                name: "Score",
                table: "ExamResults");

            migrationBuilder.DropColumn(
                name: "SubmittedAt",
                table: "ExamResults");

            migrationBuilder.RenameColumn(
                name: "Room",
                table: "Exams",
                newName: "ExamName");

            migrationBuilder.AddColumn<double>(
                name: "Marks",
                table: "ExamResults",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<Guid>(
                name: "SubjectOid",
                table: "ExamResults",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_ExamResults_SubjectOid",
                table: "ExamResults",
                column: "SubjectOid");

            migrationBuilder.AddForeignKey(
                name: "FK_ExamResults_Students_StudentOid",
                table: "ExamResults",
                column: "StudentOid",
                principalTable: "Students",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ExamResults_Subjects_SubjectOid",
                table: "ExamResults",
                column: "SubjectOid",
                principalTable: "Subjects",
                principalColumn: "Oid",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
