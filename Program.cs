using ActiveCampaignAPIWrapper.Authentication;

var builder = WebApplication.CreateBuilder(args);

// Access the ActiveCampaign section from appsettings.json
var activeCampaignSettings = builder.Configuration.GetSection("ActiveCampaign");

// Initialize the ActiveCampaign client with values from appsettings.json
var apiKey = activeCampaignSettings["ApiKey"];
var baseUrl = activeCampaignSettings["BaseUrl"];

var client = new ActiveCampaignClient(apiKey, baseUrl);

builder.Services.AddSingleton(client); // Register it for DI if needed

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
