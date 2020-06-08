using System;
using System.Collections.Generic;
using System.Text;
using TaskAssignementManager.Domain.Enums;

namespace TaskAssignementManager.Domain.Tasks
{
    public class UserTask : IUserTask
    {
        public string Name { get; set ; }
        public DateTime Deadline { get ; set ; }
        public Guid UsersId { get; set; } = Guid.Empty; // Unassigned by default
        public CompletionStatus Status { get ; set ; }
    }
}
