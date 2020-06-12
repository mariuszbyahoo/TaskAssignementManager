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

        private ICRUDRepo<UserTask> _tasks;

        public TaskGroupsRepo(TasksDbContext ctx, ICRUDRepo<UserTask> tasks)
        {
            Ctx = ctx;
            _tasks = tasks;
        }

        public async Task<TaskGroup> AddEntity(TaskGroup entity)
        {
            await Ctx.TaskGroups.AddAsync(entity);
            await Ctx.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteEntity(TaskGroup entity)
        {
            var matchingTasks = Ctx.UserTasks.Where(t => t.GroupId.Equals(entity.Id)).ToArray();
            Ctx.UserTasks.RemoveRange(matchingTasks);
            Ctx.TaskGroups.Remove(entity);
            await Ctx.SaveChangesAsync();
        }

        public async Task<ICollection<TaskGroup>> GetEntites()
        {
            var res =  await Ctx.TaskGroups.ToArrayAsync();
            var allTasks = await _tasks.GetEntites();
            foreach (var group in res)
            {
                var tasks = allTasks.Where(t => t.GroupId.Equals(group.Id)).ToArray();
                for (int i = 0; i < tasks.Count(); i++)
                {
                    group.UserTasks.Prepend<UserTask>(tasks[i]);
                }
            }
            return res;
        }

        public TaskGroup GetEntity(Guid entityId)
        {
            var res = Ctx.TaskGroups.Where(g => g.Id.Equals(entityId)).FirstOrDefault();
            var allTasks = _tasks.GetEntites().Result;
            var tasks = allTasks.Where(t => t.GroupId.Equals(res.Id)).ToArray();
            for (int i = 0; i < tasks.Count(); i++)
            {
                res.UserTasks.Prepend<UserTask>(tasks[i]);
            }
            return res;
        }

        public async Task<TaskGroup> UpdateEntity(TaskGroup entity)
        {
            Ctx.TaskGroups.Update(entity);
            await Ctx.SaveChangesAsync();
            return entity;
        }
    }
}
