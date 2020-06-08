using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;
using TaskAssignementManager.Domain.Enums;

namespace TaskAssignementManager.Domain.Tasks
{
    public class UserTask
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // PK
        public string Name { get; set ; }
        public DateTime Deadline { get ; set ; }
        public Guid UsersId { get; set; } = Guid.Empty; // Unassigned by default
        public CompletionStatus Status { get ; set ; }
        [JsonIgnore]
        public TaskGroup Group { get; set; }
        public Guid GroupId { get; set; } // FK
    }
}
