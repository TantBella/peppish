using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_Peppish.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddHouseholdJoinRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "JoinCodes",
                type: "character varying(8)",
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);

            migrationBuilder.CreateTable(
                name: "HouseholdJoinRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    HouseholdId = table.Column<Guid>(type: "uuid", nullable: false),
                    JoinCodeId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HouseholdJoinRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HouseholdJoinRequests_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HouseholdJoinRequests_Households_HouseholdId",
                        column: x => x.HouseholdId,
                        principalTable: "Households",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HouseholdJoinRequests_JoinCodes_JoinCodeId",
                        column: x => x.JoinCodeId,
                        principalTable: "JoinCodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HouseholdJoinRequests_HouseholdId",
                table: "HouseholdJoinRequests",
                column: "HouseholdId");

            migrationBuilder.CreateIndex(
                name: "IX_HouseholdJoinRequests_JoinCodeId",
                table: "HouseholdJoinRequests",
                column: "JoinCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_HouseholdJoinRequests_UserId",
                table: "HouseholdJoinRequests",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HouseholdJoinRequests");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "JoinCodes",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(8)",
                oldMaxLength: 8);
        }
    }
}
