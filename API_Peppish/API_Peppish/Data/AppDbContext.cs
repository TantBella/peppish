using API_Peppish.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Household> Households { get; set; } = null!;
    public DbSet<JoinCode> JoinCodes { get; set; } = null!;
    public DbSet<ChoreTemplate> ChoreTemplates { get; set; } = null!;
    public DbSet<ChoreAssignment> ChoreAssignments { get; set; } = null!;
    public DbSet<ChoreInstance> ChoreInstances { get; set; } = null!;
    public DbSet<RewardLedger> RewardLedgers { get; set; } = null!;
    public DbSet<AvatarProgress> AvatarProgresses { get; set; } = null!;
    public DbSet<Notification> Notifications { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Household
        modelBuilder.Entity<Household>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.Property(e => e.CreatedAt).IsRequired();
        });

        // JoinCode
        modelBuilder.Entity<JoinCode>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Code)
                .IsRequired()
                .HasMaxLength(8);

            entity.Property(e => e.HouseholdId)
                .IsRequired();

            entity.Property(e => e.CreatedByUserId)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.ExpiresAt)
                .IsRequired();

            entity.Property(e => e.IsUsed)
                .IsRequired();

            entity.HasOne<Household>()
                .WithMany()
                .HasForeignKey(e => e.HouseholdId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.Code)
                .IsUnique();
        });

        // ChoreTemplate
        modelBuilder.Entity<ChoreTemplate>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.HouseholdId).IsRequired();
            entity.Property(e => e.Title).IsRequired().HasMaxLength(256);
            entity.Property(e => e.Description).HasMaxLength(1024);

            entity.Property(e => e.RewardValue).HasPrecision(10, 2).IsRequired();
            entity.Property(e => e.RewardType).IsRequired();

            entity.Property(e => e.Recurrence).IsRequired();
            entity.Property(e => e.CreatedByUserId).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();

            entity.HasOne<Household>()
                .WithMany()
                .HasForeignKey(e => e.HouseholdId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ChoreAssignment
        modelBuilder.Entity<ChoreAssignment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.HouseholdId).IsRequired();
            entity.Property(e => e.ChoreTemplateId).IsRequired();
            entity.Property(e => e.AssignedToUserId).IsRequired();
            entity.Property(e => e.AssignedByUserId).IsRequired();
            entity.Property(e => e.StartDate).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();

            entity.HasOne<Household>()
                .WithMany()
                .HasForeignKey(e => e.HouseholdId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<ChoreTemplate>()
                .WithMany()
                .HasForeignKey(e => e.ChoreTemplateId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(e => e.AssignedToUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(e => e.AssignedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ChoreInstance
        modelBuilder.Entity<ChoreInstance>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.HouseholdId).IsRequired();
            entity.Property(e => e.ChoreAssignmentId).IsRequired();
            entity.Property(e => e.DueDate).IsRequired();
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();

            entity.HasOne<Household>()
                .WithMany()
                .HasForeignKey(e => e.HouseholdId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<ChoreAssignment>()
                .WithMany()
                .HasForeignKey(e => e.ChoreAssignmentId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => new { e.ChoreAssignmentId, e.DueDate })
                .IsUnique()
                .HasDatabaseName("IX_ChoreInstance_AssignmentDate_Unique");
        });

        // RewardLedger
        modelBuilder.Entity<RewardLedger>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.HouseholdId).IsRequired();
            entity.Property(e => e.UserId).IsRequired();

            entity.Property(e => e.MoneyAmount).HasPrecision(10, 2).IsRequired();
            entity.Property(e => e.XpAmount).IsRequired();

            entity.Property(e => e.Reason).IsRequired().HasMaxLength(512);
            entity.Property(e => e.CreatedAt).IsRequired();

            entity.HasOne<Household>()
                .WithMany()
                .HasForeignKey(e => e.HouseholdId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // AvatarProgress
        modelBuilder.Entity<AvatarProgress>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.HouseholdId).IsRequired();
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.CurrentLevel).IsRequired().HasDefaultValue(1);
            entity.Property(e => e.CurrentXp).IsRequired().HasDefaultValue(0);
            entity.Property(e => e.DailyProgressPercent).IsRequired().HasDefaultValue(0);
            entity.Property(e => e.UpdatedAt).IsRequired();

            entity.HasOne<Household>()
                .WithMany()
                .HasForeignKey(e => e.HouseholdId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.HouseholdId, e.UserId })
                .IsUnique()
                .HasDatabaseName("IX_AvatarProgress_Household_User_Unique");
        });

        // Notification
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.Type).IsRequired().HasMaxLength(128);
            entity.Property(e => e.Payload).HasMaxLength(4000);
            entity.Property(e => e.IsRead).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();

            entity.HasOne<Household>()
                .WithMany()
                .HasForeignKey(e => e.HouseholdId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(e => new { e.UserId, e.CreatedAt }).HasDatabaseName("IX_Notification_User_CreatedAt");
        });
    }
}



