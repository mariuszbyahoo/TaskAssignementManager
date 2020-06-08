using System;
using System.Collections.Generic;
using System.Text;

namespace TaskAssignementManager.Domain.Tasks
{
    public class TaskGroup : ITaskGroup
    {
        public string Name { get ; set ; }
        public IUserTask[] UserTasks { get ; set; }
    }
}
