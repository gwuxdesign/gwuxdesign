using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace GwuxDesign.PRAT.Acceptance.Support
{
    public static class JsonDataClient
    {
        private static readonly HttpClient _client = new HttpClient();

        public static async Task<T> GetAsync<T>(string url)
        {
            return await _client.GetFromJsonAsync<T>(url);
        }
    }
}