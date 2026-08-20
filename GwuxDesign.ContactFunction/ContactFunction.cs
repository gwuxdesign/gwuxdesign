using System.Net;
using System.Net.Http.Json;
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
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", "options")] HttpRequestData req)
    {
        var allowedOrigin = Environment.GetEnvironmentVariable("ALLOWED_ORIGIN") ?? "https://www.gwuxdesign.co.uk";

        // Handle the browser's CORS preflight request before doing anything else.
        if (req.Method == "OPTIONS")
        {
            var preflightResponse = req.CreateResponse(HttpStatusCode.OK);
            preflightResponse.Headers.Add("Access-Control-Allow-Origin", allowedOrigin);
            preflightResponse.Headers.Add("Access-Control-Allow-Methods", "POST, OPTIONS");
            preflightResponse.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
            return preflightResponse;
        }

        var payload = await req.ReadFromJsonAsync<ContactRequest>();

        if (payload is null || string.IsNullOrWhiteSpace(payload.Name)
            || string.IsNullOrWhiteSpace(payload.Email)
            || string.IsNullOrWhiteSpace(payload.Message)
            || string.IsNullOrWhiteSpace(payload.TurnstileToken))
        {
            return await BadRequest(req, allowedOrigin, "Missing required fields.");
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
            return await BadRequest(req, allowedOrigin, "CAPTCHA verification failed.");
        }

        var sendGridKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
        var client = new SendGridClient(sendGridKey);

        // Email to you, with the submitter's message and a reply-to set to their address.
        var toEmail = Environment.GetEnvironmentVariable("CONTACT_TO_EMAIL");
        var msg = MailHelper.CreateSingleEmail(
            from: new EmailAddress("contact@gwuxdesign.co.uk", "GW UX Design contact form"),
            to: new EmailAddress(toEmail),
            subject: $"New contact form message from {payload.Name}",
            plainTextContent: $"From: {payload.Name} ({payload.Email})\n\n{payload.Message}",
            htmlContent: null);
        msg.ReplyTo = new EmailAddress(payload.Email, payload.Name);

        var sendResult = await client.SendEmailAsync(msg);

        if (!sendResult.IsSuccessStatusCode)
        {
            _logger.LogError("SendGrid send failed with status {Status}", sendResult.StatusCode);
            return await BadRequest(req, allowedOrigin, "Failed to send message. Please try again.");
        }

        // Auto-reply confirmation back to the submitter, including their original message.
        var confirmationMsg = MailHelper.CreateSingleEmail(
            from: new EmailAddress("contact@gwuxdesign.co.uk", "GW UX Design"),
            to: new EmailAddress(payload.Email, payload.Name),
            subject: "Thanks for your message",
            plainTextContent:
                $"Thanks for getting in touch. I'll get back to you as soon as I can.\n\n" +
                $"---\n" +
                $"Your original message:\n\n{payload.Message}",
            htmlContent: null);

        var confirmationResult = await client.SendEmailAsync(confirmationMsg);

        if (!confirmationResult.IsSuccessStatusCode)
        {
            // The message to you already succeeded, this second email is a courtesy,
            // not the primary success condition — log it but don't fail the whole request.
            _logger.LogWarning(
                "Confirmation email to {Email} failed with status {Status}",
                payload.Email, confirmationResult.StatusCode);
        }

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Access-Control-Allow-Origin", allowedOrigin);
        await response.WriteAsJsonAsync(new { success = true });
        return response;
    }

    private static async Task<HttpResponseData> BadRequest(HttpRequestData req, string allowedOrigin, string message)
    {
        var response = req.CreateResponse(HttpStatusCode.BadRequest);
        response.Headers.Add("Access-Control-Allow-Origin", allowedOrigin);
        await response.WriteAsJsonAsync(new { success = false, error = message });
        return response;
    }
}

public record ContactRequest(string Name, string Email, string Message, string TurnstileToken);
public record TurnstileResult(bool Success);