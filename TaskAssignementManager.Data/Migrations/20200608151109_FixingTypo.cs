using Microsoft.EntityFrameworkCore.Migrations;

namespace TaskAssignementManager.Data.Migrations
{
    public partial class FixingTypo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserTasks_TaskGorups_GroupId",
                table: "UserTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskGorups",
                table: "TaskGorups");

            migrationBuilder.RenameTable(
                name: "TaskGorups",
                newName: "TaskGroups");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskGroups",
                table: "TaskGroups",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserTasks_TaskGroups_GroupId",
                table: "UserTasks",
                column: "GroupId",
                principalTable: "TaskGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserTasks_TaskGroups_GroupId",
                table: "UserTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskGroups",
                table: "TaskGroups");

            migrationBuilder.RenameTable(
                name: "TaskGroups",
                newName: "TaskGorups");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskGorups",
                table: "TaskGorups",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserTasks_TaskGorups_GroupId",
                table: "UserTasks",
                column: "GroupId",
                principalTable: "TaskGorups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
