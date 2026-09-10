using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_Peppish.Data.Migrations
{
    /// <inheritdoc />
    public partial class MakeChoreDatesOptional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DueDate",
                table: "ChoreAssignments",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DueDate",
                table: "ChoreAssignments");
        }
    }
}
