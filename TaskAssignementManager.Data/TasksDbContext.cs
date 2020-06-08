using Microsoft.EntityFrameworkCore;
using System;
using TaskAssignementManager.Domain.Tasks;

namespace TaskAssignementManager.Data
{
    public class TasksDbContext : DbContext
    {
        protected DbSet<TaskGroup> TaskGorups { get; set; }
        protected DbSet<UserTask> UserTasks { get; set; } // this table corresponds to each task, 
        public TasksDbContext(DbContextOptions<TasksDbContext> options) : base(options)
        {
        }
            protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskGroup>().HasData(
                new TaskGroup
                {
                    Name = "SeedTaskGroup",
                    UserTasks = new UserTask[]
                    {
                        new UserTask()
                        {
                            Name = "SeedTask1_Unassigned",
                            Deadline = DateTime.Now.AddDays(10),
                            Status = Domain.Enums.CompletionStatus.New
                        },
                        new UserTask()
                        {
                            Name = "SeedTask2_Unassigned",
                            Deadline = DateTime.Now.AddDays(5),
                            Status = Domain.Enums.CompletionStatus.InProgress
                        },
                        new UserTask()
                        {
                            Name = "Completed_SeedTask3_AssignedToUnexistingUser",
                            Deadline = DateTime.Now.AddDays(8),
                            Status = Domain.Enums.CompletionStatus.Done
                        }
                    }
                }
            );
        }
    }
}
