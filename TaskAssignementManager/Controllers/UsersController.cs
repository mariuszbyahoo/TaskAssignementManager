using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskAssignementManager.Domain;

namespace TaskAssignementManager.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [HttpGet]
        public ActionResult<User> GetUsers()
        {
            var result = new User[]
            {
                new User("b4bf4e52-e77a-4f22-9de6-6af24fa3fae1", "Krystian", "Nowak"),
                new User("5ac642a7-8601-408b-b72b-c75df716cb6d", "Maciej", "Kowalski"),
                new User("20da77c2-fbdb-407e-803e-eb286816ce8b", "Zbigniew", "Czajka")
            };
            return Ok(result);
        }
    }
}