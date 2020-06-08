using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskAssignementManager.Data;
using TaskAssignementManager.Domain.Tasks;

namespace TaskAssignementManager.Web.Controllers
{
    [Route("tasks")]
    public class TasksController : ControllerBase
    {
        private ICRUDRepo<TaskGroup> _taskGroups;
        private ICRUDRepo<UserTask> _userTasks;

        public TasksController(ICRUDRepo<TaskGroup> taskGroups, ICRUDRepo<UserTask> userTasks)
        {
            _taskGroups = taskGroups;
            _userTasks = userTasks;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<UserTask>>> Get()
        {
            var result = await _userTasks.GetEntites();
            return Ok(result);
        }

        [Route("grouped")]
        [HttpGet]
        public async Task<ActionResult<ICollection<TaskGroup>>> GetGrouped()
        {
            var result = await _taskGroups.GetEntites();
            return Ok(result);
        }
    }
}
