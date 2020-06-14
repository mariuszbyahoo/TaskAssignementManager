using FluentAssertions;
using FluentAssertions.Common;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using NUnit.Framework;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace TaskAssignementManager.IntegrationTests
{
    public class TestsBase
    {
        Configuration Configuration { get; set; }
        public IRestClient Client { get; set; }

        [OneTimeSetUp]
        public void OneTimeSetUp()
        {
            var configFiles = new List<string>();

            var externalCfgJson = TestContext.Parameters.Get("config");
            //if (!string.IsNullOrWhiteSpace(externalCfgJson) && File.Exists(externalCfgJson.SolvePath()))
            //{
            //    configFiles.Add(externalCfgJson);
            //}


            //if (Configuration == null || string.IsNullOrWhiteSpace(Configuration.GetSection("ApiEndpoint"))
            //    throw new InvalidOperationException("Tests have not been configured properly. Do make sure that token is propperly provided");
            Configuration = JsonConvert.DeserializeObject<Configuration>(File.ReadAllText("appsettings.json"));
            var endpoint = Configuration.ApiEndpoints["Default"];
            var stringEndpoint = endpoint.ToString();
            var contextEndpoint = TestContext.Parameters.Get("endpoint");
            Client = new RestClient(stringEndpoint);
        }

        /// <summary>
        /// Calls a rest api; auto configures the endpoint and attaches api token
        /// </summary>
        /// <param name="route"></param>
        /// <param name="method"></param>
        /// <param name="queryParams"></param>
        /// <param name="data">Method serializes this object to JSON, sends it in request body</param>
        /// <returns></returns>
        public async Task<RestSharp.IRestResponse> RestApiCall(
            string route,
            Method method = Method.GET,
            Dictionary<string, string> queryParams = null,
            object data = null
        )
        {
            queryParams ??= new Dictionary<string, string>();
            var request = new RestRequest(resource: route, method: method);
            var body = data ?? "";
            if (!body.IsSameOrEqualTo(""))
            {
                body = JsonConvert.SerializeObject(data);
                request.AddJsonBody(body);
            }
            if(queryParams.Count > 0)
            {
                foreach (KeyValuePair<string, string> entry in queryParams)
                {
                    request.AddQueryParameter(entry.Key, entry.Value);
                }
            }
            var response = await Client.ExecuteAsync(request);
            return response;
        }
    }
}