using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskAssignementManager.Domain.Tasks;

namespace TaskAssignementManager.Data
{
    public class UserTasksRepo : ICRUDRepo<UserTask>
    {
        public TasksDbContext Ctx { get; set; }

        public UserTasksRepo(TasksDbContext ctx)
        {
            Ctx = ctx;
        }

        public async Task<UserTask> AddEntity(UserTask entity)
        {
            await Ctx.UserTasks.AddAsync(entity);
            await Ctx.SaveChangesAsync();
            return entity;
        }

        public async Task<UserTask> UpdateEntity(UserTask entity)
        {
            Ctx.UserTasks.Update(entity);
            await Ctx.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteEntity(UserTask entity)
        {
            Ctx.UserTasks.Remove(entity);
            await Ctx.SaveChangesAsync();
        }

        public UserTask GetEntity(Guid entityId)
        {
            return Ctx.UserTasks.Where(t => t.Id.Equals(entityId)).FirstOrDefault();
        }

        public async Task<ICollection<UserTask>> GetEntites()
        {
            return await Ctx.UserTasks.ToArrayAsync();
        }
    }
}
