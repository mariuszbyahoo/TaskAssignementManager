using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TaskAssignementManager.Data.Migrations
{
    public partial class SomeMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserTasks",
                keyColumn: "Id",
                keyValue: new Guid("61f3ebd6-b3b8-4012-80c7-29d3cda34fa1"));

            migrationBuilder.DeleteData(
                table: "UserTasks",
                keyColumn: "Id",
                keyValue: new Guid("6ea08c5e-6a45-4cc0-aa7c-ff93552d140e"));

            migrationBuilder.DeleteData(
                table: "UserTasks",
                keyColumn: "Id",
                keyValue: new Guid("f68d2f1a-95c5-432d-ae36-b260c8ca6750"));

            migrationBuilder.DeleteData(
                table: "TaskGroups",
                keyColumn: "Id",
                keyValue: new Guid("4cd3c703-4164-4183-a09d-38eccab3ccad"));

            migrationBuilder.InsertData(
                table: "TaskGroups",
                columns: new[] { "Id", "Name" },
                values: new object[] { new Guid("02be9a27-4a0b-4fa0-aa56-8a8ad68b3b4f"), "SeedTaskGroup" });

            migrationBuilder.InsertData(
                table: "UserTasks",
                columns: new[] { "Id", "Deadline", "GroupId", "Name", "Status", "UsersId" },
                values: new object[] { new Guid("ffaeed64-ddcf-46f7-b9ed-9b65ab1c9e6c"), new DateTime(2020, 6, 18, 19, 35, 18, 544, DateTimeKind.Local).AddTicks(7101), new Guid("02be9a27-4a0b-4fa0-aa56-8a8ad68b3b4f"), "SeedTask1_Unassigned", 0, new Guid("00000000-0000-0000-0000-000000000000") });

            migrationBuilder.InsertData(
                table: "UserTasks",
                columns: new[] { "Id", "Deadline", "GroupId", "Name", "Status", "UsersId" },
                values: new object[] { new Guid("c2de67e9-a95c-48ba-807c-42899ac06bce"), new DateTime(2020, 6, 13, 19, 35, 18, 551, DateTimeKind.Local).AddTicks(2306), new Guid("02be9a27-4a0b-4fa0-aa56-8a8ad68b3b4f"), "SeedTask2_Unassigned", 1, new Guid("00000000-0000-0000-0000-000000000000") });

            migrationBuilder.InsertData(
                table: "UserTasks",
                columns: new[] { "Id", "Deadline", "GroupId", "Name", "Status", "UsersId" },
                values: new object[] { new Guid("880e13ea-3e6e-4df9-a379-d7df481ee545"), new DateTime(2020, 6, 16, 19, 35, 18, 551, DateTimeKind.Local).AddTicks(2466), new Guid("02be9a27-4a0b-4fa0-aa56-8a8ad68b3b4f"), "Completed_SeedTask3_AssignedToUnexistingUser", 2, new Guid("b4bf4e52-e77a-4f22-9de6-6af24fa3fae1") });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserTasks",
                keyColumn: "Id",
                keyValue: new Guid("880e13ea-3e6e-4df9-a379-d7df481ee545"));

            migrationBuilder.DeleteData(
                table: "UserTasks",
                keyColumn: "Id",
                keyValue: new Guid("c2de67e9-a95c-48ba-807c-42899ac06bce"));

            migrationBuilder.DeleteData(
                table: "UserTasks",
                keyColumn: "Id",
                keyValue: new Guid("ffaeed64-ddcf-46f7-b9ed-9b65ab1c9e6c"));

            migrationBuilder.DeleteData(
                table: "TaskGroups",
                keyColumn: "Id",
                keyValue: new Guid("02be9a27-4a0b-4fa0-aa56-8a8ad68b3b4f"));

            migrationBuilder.InsertData(
                table: "TaskGroups",
                columns: new[] { "Id", "Name" },
                values: new object[] { new Guid("4cd3c703-4164-4183-a09d-38eccab3ccad"), "SeedTaskGroup" });

            migrationBuilder.InsertData(
                table: "UserTasks",
                columns: new[] { "Id", "Deadline", "GroupId", "Name", "Status", "UsersId" },
                values: new object[] { new Guid("61f3ebd6-b3b8-4012-80c7-29d3cda34fa1"), new DateTime(2020, 6, 18, 18, 31, 19, 396, DateTimeKind.Local).AddTicks(2174), new Guid("4cd3c703-4164-4183-a09d-38eccab3ccad"), "SeedTask1_Unassigned", 0, new Guid("00000000-0000-0000-0000-000000000000") });

            migrationBuilder.InsertData(
                table: "UserTasks",
                columns: new[] { "Id", "Deadline", "GroupId", "Name", "Status", "UsersId" },
                values: new object[] { new Guid("f68d2f1a-95c5-432d-ae36-b260c8ca6750"), new DateTime(2020, 6, 13, 18, 31, 19, 400, DateTimeKind.Local).AddTicks(9729), new Guid("4cd3c703-4164-4183-a09d-38eccab3ccad"), "SeedTask2_Unassigned", 1, new Guid("00000000-0000-0000-0000-000000000000") });

            migrationBuilder.InsertData(
                table: "UserTasks",
                columns: new[] { "Id", "Deadline", "GroupId", "Name", "Status", "UsersId" },
                values: new object[] { new Guid("6ea08c5e-6a45-4cc0-aa7c-ff93552d140e"), new DateTime(2020, 6, 16, 18, 31, 19, 400, DateTimeKind.Local).AddTicks(9864), new Guid("4cd3c703-4164-4183-a09d-38eccab3ccad"), "Completed_SeedTask3_AssignedToUnexistingUser", 2, new Guid("4a826ac4-fd61-4464-b6c3-246395923e2e") });
        }
    }
}
