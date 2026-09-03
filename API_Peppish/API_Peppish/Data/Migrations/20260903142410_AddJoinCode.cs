using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_Peppish.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJoinCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "RewardLedgers",
                newName: "MoneyAmount");

            migrationBuilder.RenameColumn(
                name: "RewardPoints",
                table: "ChoreTemplates",
                newName: "RewardType");

            migrationBuilder.RenameColumn(
                name: "RewardAmount",
                table: "ChoreTemplates",
                newName: "RewardValue");

            migrationBuilder.AddColumn<Guid>(
                name: "ChoreId",
                table: "RewardLedgers",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "XpAmount",
                table: "RewardLedgers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Households",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256);

            migrationBuilder.AddColumn<Guid>(
                name: "RewardLedgerId",
                table: "ChoreInstances",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "JoinCodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    HouseholdId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsUsed = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JoinCodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JoinCodes_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JoinCodes_Households_HouseholdId",
                        column: x => x.HouseholdId,
                        principalTable: "Households",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_HouseholdId",
                table: "AspNetUsers",
                column: "HouseholdId");

            migrationBuilder.CreateIndex(
                name: "IX_JoinCodes_Code",
                table: "JoinCodes",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_JoinCodes_CreatedByUserId",
                table: "JoinCodes",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_JoinCodes_HouseholdId",
                table: "JoinCodes",
                column: "HouseholdId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Households_HouseholdId",
                table: "AspNetUsers",
                column: "HouseholdId",
                principalTable: "Households",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Households_HouseholdId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "JoinCodes");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_HouseholdId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ChoreId",
                table: "RewardLedgers");

            migrationBuilder.DropColumn(
                name: "XpAmount",
                table: "RewardLedgers");

            migrationBuilder.DropColumn(
                name: "RewardLedgerId",
                table: "ChoreInstances");

            migrationBuilder.RenameColumn(
                name: "MoneyAmount",
                table: "RewardLedgers",
                newName: "Amount");

            migrationBuilder.RenameColumn(
                name: "RewardValue",
                table: "ChoreTemplates",
                newName: "RewardAmount");

            migrationBuilder.RenameColumn(
                name: "RewardType",
                table: "ChoreTemplates",
                newName: "RewardPoints");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Households",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);
        }
    }
}
