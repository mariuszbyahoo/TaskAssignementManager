using System;
using System.Collections.Generic;
using System.Text;

namespace TaskAssignementManager.Domain.Tasks
{
    public class TaskGroup
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // PK
        public string Name { get ; set ; }
        public IEnumerable<UserTask> UserTasks { get ; set; } // Many
    }
}
