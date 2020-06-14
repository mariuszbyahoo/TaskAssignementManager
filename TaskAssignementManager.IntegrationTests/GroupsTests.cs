using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TaskAssignementManager.Domain;
using TaskAssignementManager.Domain.Tasks;

namespace TaskAssignementManager.IntegrationTests
{
    class GroupsTests : TestsBase
    {
        private Guid setUpGroupUuid;
        private string route = "api/groups";

        [SetUp]
        public async Task SetUp()
        {
            setUpGroupUuid = Guid.NewGuid();
            var newGroup = new TaskGroup()
            {
                Id = setUpGroupUuid,
                Name = "IntegrationTest",
                UserTasks = new UserTask[] {
                    new UserTask() { Id = Guid.NewGuid(), GroupId = setUpGroupUuid, Name = "Test"}
                }
            };
            await RestApiCall(route, RestSharp.Method.POST, null, newGroup);
        }

        [Test]
        public async Task GetAllGroups_WhenGET_ReturnsOkAndNotEmptyGroupsList()
        {
            var res = await RestApiCall(route);
            res.StatusCode.Should().Be(HttpStatusCode.OK);

            var list = JsonConvert.DeserializeObject<IList<TaskGroup>>(res.Content);
            list.Count.Should().BeGreaterThan(0);
        }

        [Test]
        public async Task GetOneGroup_WhenGetWithQueryParamSupplied_ReturnsGroupFromTestsWithUserTasksPopulated()
        {
            var queryParams = new Dictionary<string, string>();
            queryParams.Add("id", setUpGroupUuid.ToString());

            var res = await RestApiCall(route, RestSharp.Method.GET, queryParams);

            res.StatusCode.Should().Be(HttpStatusCode.OK);

            var groups = JsonConvert.DeserializeObject<TaskGroup[]>(res.Content);
            groups.Length.Should().BeGreaterThan(0);
            
            var group = groups.Where(g => g.Id.Equals(setUpGroupUuid)).FirstOrDefault();

            group.Should().NotBeNull();
            group.UserTasks.Count().Should().BeGreaterThan(0);
        }

        [TearDown]
        public async Task TearDown()
        {
            await RestApiCall($"{route}/{setUpGroupUuid}", RestSharp.Method.DELETE);
        }
    }
}
