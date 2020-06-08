using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskAssignementManager.Domain.Tasks;

namespace TaskAssignementManager.Data
{
    public class TaskGroupsRepo : ICRUDRepo<TaskGroup>
    {
        public TasksDbContext Ctx { get; set; }

        public async Task<TaskGroup> AddEntity(TaskGroup entity)
        {
            await Ctx.TaskGroups.AddAsync(entity);
            await Ctx.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteEntity(TaskGroup entity)
        {
            Ctx.TaskGroups.Remove(entity);
            await Ctx.SaveChangesAsync();
        }

        public async Task<ICollection<TaskGroup>> GetEntites()
        {
            return await Ctx.TaskGroups.ToArrayAsync();
        }

        public TaskGroup GetEntity(Guid entityId)
        {
            return Ctx.TaskGroups.Where(g => g.Id.Equals(entityId)).FirstOrDefault();
        }

        public async Task<TaskGroup> UpdateEntity(TaskGroup entity)
        {
            Ctx.TaskGroups.Update(entity);
            await Ctx.SaveChangesAsync();
            return entity;
        }
    }
}
