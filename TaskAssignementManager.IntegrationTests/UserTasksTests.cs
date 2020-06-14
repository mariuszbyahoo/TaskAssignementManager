using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TaskAssignementManager.Domain.Tasks;

namespace TaskAssignementManager.IntegrationTests
{
    class UserTasksTests : TestsBase
    {
        private Guid setUpTaskUuid;
        private string route = "api/tasks";
        private Guid postTaskId = Guid.NewGuid();
        private Guid testGroupId;

        [OneTimeSetUp]
        public async Task OneTimeSetUp()
        {
            var serializedGroups = await RestApiCall("api/groups", RestSharp.Method.GET, null, null);
            var groups = JsonConvert.DeserializeObject<TaskGroup[]>(serializedGroups.Content);
            testGroupId = groups[0].Id;
        }

        [SetUp]
        public async Task SetUp()
        {
            setUpTaskUuid = Guid.NewGuid();
            var newTask = new UserTask()
            {
                Id = setUpTaskUuid,
                Name = "IntegrationTest",
                GroupId = testGroupId
            };
            await RestApiCall(route, RestSharp.Method.POST, null, newTask);
        }

        [Test]
        public async Task GetAllTasks_WhenGET_ReturnsOkAndTasksList()
        {
            var res = await RestApiCall(route);
            res.StatusCode.Should().Be(HttpStatusCode.OK);

            var list = JsonConvert.DeserializeObject<IList<UserTask>>(res.Content);
            list.Count.Should().BeGreaterThan(0);
        }

        [Test]
        public async Task GetOneTask_WhenGetWithQueryParamSupplied_ReturnsTaskFromTests()
        {
            var queryParams = new Dictionary<string, string>();
            queryParams.Add("id", setUpTaskUuid.ToString());

            var res = await RestApiCall($"{route}/take", RestSharp.Method.GET, queryParams);

            res.StatusCode.Should().Be(HttpStatusCode.OK);

            var task = JsonConvert.DeserializeObject<UserTask>(res.Content);
            task.Should().NotBeNull();
            task.Id.Should().Be(setUpTaskUuid);
        }

        [Test]
        public async Task Patch_WhenPatchWithDifferentName_ChangesTasksNameAndReturnsItInResponse()
        {
            var newName = "Integration Test PATCHED name";
            var queryParams = new Dictionary<string, string>();
            queryParams.Add("id", setUpTaskUuid.ToString());
            var getResult = await RestApiCall($"{route}/take", RestSharp.Method.GET, queryParams);
            var taskToPatch = JsonConvert.DeserializeObject<UserTask>(getResult.Content);
            taskToPatch.Name = newName;

            var patchResult = await RestApiCall(route, RestSharp.Method.PATCH, null, taskToPatch);
            patchResult.StatusCode.Should().Be(HttpStatusCode.OK);
            var resultGroup = JsonConvert.DeserializeObject<UserTask>(patchResult.Content);
            resultGroup.Id.Should().Be(setUpTaskUuid);
            resultGroup.Name.Should().Be(newName);
        }

        [Test]
        public async Task Post_WhenPost_AddsTaskToTheDbAndReturnsItInResponseBody()
        {
            string postTaskName = "POST";

            var newTask = new UserTask()
            {
                Id = postTaskId,
                Name = postTaskName,
                GroupId = testGroupId
            };
            var res = await RestApiCall(route, RestSharp.Method.POST, null, newTask);
            res.StatusCode.Should().Be(HttpStatusCode.Created);
            var resGroup = JsonConvert.DeserializeObject<UserTask>(res.Content);
            resGroup.Id.Should().Be(postTaskId.ToString());
            resGroup.Name.Should().Be(postTaskName);
        }

        [Test]
        public async Task ZZ_Delete_WhenDelete_RemovesTaskFromDBAndReturnsNoContent()
        {
            var initialGroups = await RestApiCall(route);
            var initialLength = JsonConvert.DeserializeObject<UserTask[]>(initialGroups.Content).Length;
            var queryParams = new Dictionary<string, string>();
            queryParams.Add("id", postTaskId.ToString());

            var deleteResult = await RestApiCall(route, RestSharp.Method.DELETE, queryParams);
            deleteResult.StatusCode.Should().Be(HttpStatusCode.NoContent);

            var resultGroups = await RestApiCall(route);
            var resultLength = JsonConvert.DeserializeObject<UserTask[]>(resultGroups.Content).Length;

            resultLength.Should().BeLessThan(initialLength);
        }

        [TearDown]
        public async Task TearDown()
        {
            var queryParams = new Dictionary<string, string>();
            queryParams.Add("id", setUpTaskUuid.ToString());

            await RestApiCall(route, RestSharp.Method.DELETE, queryParams);
        }
    }
}
