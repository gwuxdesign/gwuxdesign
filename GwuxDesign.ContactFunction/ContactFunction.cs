using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;

public class ContactFunction
{
    private readonly ILogger _logger;
    private readonly HttpClient _httpClient;

    public ContactFunction(ILoggerFactory loggerFactory, IHttpClientFactory httpClientFactory)
    {
        _logger = loggerFactory.CreateLogger<ContactFunction>();
        _httpClient = httpClientFactory.CreateClient();
    }

    [Function("Contact")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
    {
        var payload = await req.ReadFromJsonAsync<ContactRequest>();

        if (payload is null || string.IsNullOrWhiteSpace(payload.Name)
            || string.IsNullOrWhiteSpace(payload.Email)
            || string.IsNullOrWhiteSpace(payload.Message)
            || string.IsNullOrWhiteSpace(payload.TurnstileToken))
        {
            return await BadRequest(req, "Missing required fields.");
        }

        var turnstileSecret = Environment.GetEnvironmentVariable("TURNSTILE_SECRET_KEY");
        var verifyResponse = await _httpClient.PostAsync(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["secret"] = turnstileSecret!,
                ["response"] = payload.TurnstileToken
            }));

        var verifyResult = await verifyResponse.Content.ReadFromJsonAsync<TurnstileResult>();
        if (verifyResult is null || !verifyResult.Success)
        {
            _logger.LogWarning("Turnstile verification failed for submission from {Email}", payload.Email);
            return await BadRequest(req, "CAPTCHA verification failed.");
        }

        var sendGridKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
        var client = new SendGridClient(sendGridKey);

        var toEmail = Environment.GetEnvironmentVariable("CONTACT_TO_EMAIL");
        var msg = MailHelper.CreateSingleEmail(
            from: new EmailAddress("no-reply@gwuxdesign.co.uk", "GW UX Design contact form"),
            to: new EmailAddress(toEmail),
            subject: $"New contact form message from {payload.Name}",
            plainTextContent: $"From: {payload.Name} ({payload.Email})\n\n{payload.Message}",
            htmlContent: null);
        msg.ReplyTo = new EmailAddress(payload.Email, payload.Name);

        var sendResult = await client.SendEmailAsync(msg);

        if (!sendResult.IsSuccessStatusCode)
        {
            _logger.LogError("SendGrid send failed with status {Status}", sendResult.StatusCode);
            return await BadRequest(req, "Failed to send message. Please try again.");
        }

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Access-Control-Allow-Origin", "https://www.gwuxdesign.co.uk");
        await response.WriteAsJsonAsync(new { success = true });
        return response;
    }

    private static async Task<HttpResponseData> BadRequest(HttpRequestData req, string message)
    {
        var response = req.CreateResponse(HttpStatusCode.BadRequest);
        response.Headers.Add("Access-Control-Allow-Origin", "https://www.gwuxdesign.co.uk");
        await response.WriteAsJsonAsync(new { success = false, error = message });
        return response;
    }
}

public record ContactRequest(string Name, string Email, string Message, string TurnstileToken);
public record TurnstileResult(bool Success);