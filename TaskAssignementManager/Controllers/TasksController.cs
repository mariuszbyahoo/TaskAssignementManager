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
    [Route("api/[controller]")]
    [ApiController]
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

        [Route("{Id}")]
        [HttpGet]
        public ActionResult<UserTask> GetUserTask(Guid Id)
        {
            var entity = _userTasks.GetEntity(Id);
            return Ok(entity);
        }

        [Route("grouped")]
        [HttpGet]
        public async Task<ActionResult<ICollection<TaskGroup>>> GetGrouped()
        {
            var result = await _taskGroups.GetEntites();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<UserTask>> Create([FromBody] UserTask entity)
        {
            await _userTasks.AddEntity(entity);
            return Created("tasks", entity);
        }

        [HttpPatch]
        public async Task<ActionResult<UserTask>> Patch([FromBody] UserTask entity)
        {
            await _userTasks.UpdateEntity(entity);
            return Ok(entity);
        }

        [HttpDelete]
        [Route("{Id}")]
        public async Task<IActionResult> Delete(Guid Id)
        {
            var entity = _userTasks.GetEntity(Id);
            await _userTasks.DeleteEntity(entity);
            return NoContent();
        }
    }
}
