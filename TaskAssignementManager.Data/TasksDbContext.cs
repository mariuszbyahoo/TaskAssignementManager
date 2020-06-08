using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using TaskAssignementManager.Domain.Tasks;

namespace TaskAssignementManager.Data
{
    public class TasksDbContext : DbContext
    {
        protected DbSet<TaskGroup> TaskGroups { get; set; }
        protected DbSet<UserTask> UserTasks { get; set; } // this table corresponds to each task, 
        public TasksDbContext(DbContextOptions<TasksDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var seedGroup = new TaskGroup
            {
                Id = Guid.NewGuid(),
                Name = "SeedTaskGroup"
            };
            modelBuilder.Entity<UserTask>()
                .HasOne(g => g.Group)
                .WithMany(t => t.UserTasks)
                .HasForeignKey(k => k.GroupId);

            modelBuilder.Entity<UserTask>().HasData(
                new UserTask[]
                {
                    new UserTask()
                        {
                            Id = Guid.NewGuid(),
                            UsersId = Guid.Empty,
                            Name = "SeedTask1_Unassigned",
                            Deadline = DateTime.Now.AddDays(10),
                            Status = Domain.Enums.CompletionStatus.New,
                            GroupId = seedGroup.Id
                        },
                        new UserTask()
                        {
                            Id = Guid.NewGuid(),
                            UsersId = Guid.Empty,
                            Name = "SeedTask2_Unassigned",
                            Deadline = DateTime.Now.AddDays(5),
                            Status = Domain.Enums.CompletionStatus.InProgress,
                            GroupId = seedGroup.Id
                        },
                        new UserTask()
                        {
                            Id = Guid.NewGuid(),
                            UsersId = Guid.NewGuid(), // some GUID
                            Name = "Completed_SeedTask3_AssignedToUnexistingUser",
                            Deadline = DateTime.Now.AddDays(8),
                            Status = Domain.Enums.CompletionStatus.Done,
                            GroupId = seedGroup.Id
                        }
                });
            modelBuilder.Entity<TaskGroup>().HasData(seedGroup);
        }
    }
}
