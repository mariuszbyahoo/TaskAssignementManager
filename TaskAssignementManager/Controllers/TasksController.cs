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

        [Route("take")]
        [HttpGet]
        public ActionResult<UserTask> GetUserTask([FromQuery] Guid Id)
        {
            var entity = _userTasks.GetEntity(Id);
            if (entity == null)
                return NotFound();
            return Ok(entity);
        }

        [Route("grouped/all")]
        [HttpGet]
        public async Task<ActionResult<TaskGroup[]>> GetGrouped()
        {
            var result = await _taskGroups.GetEntites();
            return Ok(result);
        }

        [Route("grouped/specific")]
        [HttpGet]
        public async Task<ActionResult<UserTask[]>> GetFromGroup(Guid id)
        {
            var collection = await _userTasks.GetEntites();
            var result = collection.Where(t => t.GroupId.Equals(id));
            if (result.Equals(null))
                return NotFound($"Not found any tasks assigned to group with an id of {id}");

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<UserTask>> Create([FromBody] UserTask entity)
        {
            if (entity.GroupId.Equals(Guid.Empty)) {
                return BadRequest("A task cannot be unassigned to any group");
            }
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
        public async Task<IActionResult> Delete([FromQuery] Guid Id)
        {
            var entity = _userTasks.GetEntity(Id);
            await _userTasks.DeleteEntity(entity);
            return NoContent();
        }
    }
}
