﻿using FluentAssertions;
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

            var res = await RestApiCall($"{route}/take", RestSharp.Method.GET, queryParams);

            res.StatusCode.Should().Be(HttpStatusCode.OK);

            var group = JsonConvert.DeserializeObject<TaskGroup>(res.Content);

            group.Should().NotBeNull();
            group.UserTasks.Count().Should().BeGreaterThan(0);
        }

        [Test]
        public async Task PatchGroup_WhenPatchWithDifferentName_ChangesGroupsNameAndReturnsItInResponse()
        {
            var newName = "Integration Test PATCHED name";
            var queryParams = new Dictionary<string, string>();
            queryParams.Add("id", setUpGroupUuid.ToString());
            var getResult = await RestApiCall($"{route}/take", RestSharp.Method.GET, queryParams);
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

        [Test]
        public async Task ZZ_Delete_WhenDelete_RemovesTaskGroupFromDBAndReturnsNoContent()
        {
            var initialGroups = await RestApiCall(route);
            var initialLength = JsonConvert.DeserializeObject<TaskGroup[]>(initialGroups.Content).Length;
            var queryParams = new Dictionary<string, string>();
            queryParams.Add("id", postGroupId.ToString());

            var deleteResult = await RestApiCall(route, RestSharp.Method.DELETE, queryParams);
            deleteResult.StatusCode.Should().Be(HttpStatusCode.NoContent);

            var resultGroups = await RestApiCall(route);
            var resultLength = JsonConvert.DeserializeObject<TaskGroup[]>(resultGroups.Content).Length;

            resultLength.Should().BeLessThan(initialLength);
        }

        [TearDown]
        public async Task TearDown()
        {
            var queryParams = new Dictionary<string, string>();
            queryParams.Add("id", setUpGroupUuid.ToString());

            await RestApiCall(route, RestSharp.Method.DELETE, queryParams);
        }
    }
}
