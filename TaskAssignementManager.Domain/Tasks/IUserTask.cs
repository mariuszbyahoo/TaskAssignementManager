using System;
using TaskAssignementManager.Domain.Enums;

namespace TaskAssignementManager.Domain.Tasks
{
    public interface IUserTask
    {
        string Name { get; set; }
        DateTime Deadline { get; set; }
        Guid UsersId { get; set; }
        CompletionStatus Status { get; set; }
    }
}