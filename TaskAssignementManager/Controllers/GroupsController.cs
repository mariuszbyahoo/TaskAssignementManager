using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TaskAssignementManager.Data;
using TaskAssignementManager.Domain.Tasks;

namespace TaskAssignementManager.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private ICRUDRepo<TaskGroup> _taskGroups;

        public GroupsController(ICRUDRepo<TaskGroup> taskGroups)
        {
            _taskGroups = taskGroups;
        }

        [HttpGet]
        public async Task<ActionResult<TaskGroup[]>> Get()
        {
            var res = await _taskGroups.GetEntites();
            return Ok(res);
        }

        [HttpGet]
        [Route("{Id}")]
        public ActionResult<TaskGroup> Get(Guid Id)
        {
            var res = _taskGroups.GetEntity(Id);
            if (res == null)
                return NotFound();
            return Ok(res);
        }

        [HttpPost]
        public async Task<ActionResult<TaskGroup>> Create([FromBody] TaskGroup entity)
        {
            if (entity.Id.Equals(Guid.Empty))
            {
                entity.Id = Guid.NewGuid();
            }
            var lookup = _taskGroups.GetEntity(entity.Id);
            if (lookup!=null)
            {
                return StatusCode(409);
            }
            var res = await _taskGroups.AddEntity(entity);
            return Created("groups", res);
        }

        [HttpPatch]
        public async Task<ActionResult<TaskGroup>> Patch([FromBody] TaskGroup entity)
        {
            try
            {
                var res = await _taskGroups.UpdateEntity(entity);
                return Ok(res);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpDelete]
        [Route("{Id}")]
        public async Task<ActionResult<TaskGroup>> Delete(Guid Id)
        {
            var entity = _taskGroups.GetEntity(Id);
            await _taskGroups.DeleteEntity(entity);
            return NoContent();
        }
    }
}