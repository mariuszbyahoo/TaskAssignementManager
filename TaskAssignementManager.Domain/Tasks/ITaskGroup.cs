using System;
using System.Collections.Generic;
using System.Text;

namespace TaskAssignementManager.Domain.Tasks
{
    public interface ITaskGroup
    {
        string Name { get; set; }
        IUserTask[] UserTasks {get; set;}
    }
}
