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
        private Guid postGroupId = Guid.NewGuid();

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

        [Test]
        public async Task PatchGroup_WhenPatchWithDifferentName_ChangesGroupsNameAndReturnsItInResponse()
        {
            var newName = "Integration Test PATCHED name";
            var queryParams = new Dictionary<string, string>();
            queryParams.Add("id", setUpGroupUuid.ToString());
            var getResult = await RestApiCall($"{route}/{setUpGroupUuid.ToString()}", RestSharp.Method.GET, queryParams);
            var groupToPatch = JsonConvert.DeserializeObject<TaskGroup>(getResult.Content);
            groupToPatch.Name = newName;

            var patchResult = await RestApiCall(route, RestSharp.Method.PATCH, null, groupToPatch);
            patchResult.StatusCode.Should().Be(HttpStatusCode.OK);
            var resultGroup = JsonConvert.DeserializeObject<TaskGroup>(patchResult.Content);
            resultGroup.Id.Should().Be(setUpGroupUuid);
            resultGroup.Name.Should().Be(newName);                
        }

        [Test]
        public async Task PostTaskGroup_WhenPost_AddsTaskGroupToTheArrayAndReturnsItInResponseBody()
        {
            string postGroupName = "POST";

            var newGroup = new TaskGroup()
            {
                Id = postGroupId,
                Name = postGroupName,
                UserTasks = null
            };
            var res = await RestApiCall(route, RestSharp.Method.POST, null, newGroup);
            res.StatusCode.Should().Be(HttpStatusCode.Created);
            var resGroup = JsonConvert.DeserializeObject<TaskGroup>(res.Content);
            resGroup.Id.Should().Be(postGroupId.ToString());
            resGroup.Name.Should().Be(postGroupName);
        }

        [TearDown]
        public async Task TearDown()
        {
            await RestApiCall($"{route}/{setUpGroupUuid}", RestSharp.Method.DELETE);
        }
    }
}
