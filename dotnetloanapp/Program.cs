using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using BookStoreDBFirst.Models;
using BookStoreDBFirst.Repository;
using BookStoreDBFirst.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);


builder.Configuration.AddJsonFile("appsettings.json");

// var keyVaultUrl = builder.Configuration["KeyVaultConfiguration:URL"];
// if (keyVaultUrl != null)
// {
//     var builtConfig = new ConfigurationBuilder()
//         .AddConfiguration(builder.Configuration)
//         .Build();

//     builder.Configuration.AddAzureKeyVault(keyVaultUrl);
// }
// builder.Configuration.AddAzureKeyVault(keyVaultUrl);




// // Retrieve SQL connection string from Key Vault
// var sqlSecretClient = new SecretClient(new Uri(keyVaultUrl), new DefaultAzureCredential());
// var sqlConnectionStringSecret = await sqlSecretClient.GetSecretAsync("secret24");
// var sqlConnectionString = sqlConnectionStringSecret.Value.Value;
// Console.WriteLine(sqlConnectionString);

// // Retrieve Blob connection string from Key Vault
// var blobSecretClient = new SecretClient(new Uri(keyVaultUrl), new DefaultAzureCredential());
// var blobConnectionStringSecret = await blobSecretClient.GetSecretAsync("blobconnsecret");
// var blobConnectionString = blobConnectionStringSecret.Value.Value;

var keyVaultUrl = builder.Configuration["KeyVaultConfiguration:URL"];

builder.Configuration.AddJsonFile("appsettings.json");  // Add this line to load appsettings.json

var keyVaultConfig = builder.Configuration.GetSection("KeyVaultConfiguration").Get<KeyVaultConfiguration>();

var secretClient = new SecretClient(new Uri(keyVaultConfig.URL), new DefaultAzureCredential());

var connectionStringSecret = secretClient.GetSecret(keyVaultConfig.ConnectionStringSecretName).Value;
var connectionString = connectionStringSecret.Value;
Console.WriteLine(connectionString);
var BlobSecret = secretClient.GetSecret(keyVaultConfig.BlobSecret).Value;
var BlobString = BlobSecret.Value;
Console.WriteLine(BlobString);
string stringValue = BlobString.ToString();



builder.Services.AddDbContext<LoanApplicationDbContext>(options =>
    options.UseSqlServer(connectionString),
    ServiceLifetime.Transient
);

builder.Services.AddScoped<IAzureStorage>(provider =>
{
    var logger = provider.GetRequiredService<ILogger<AzureStorage>>();
    var containerName = builder.Configuration.GetValue<string>("BlobContainerName");

    return new AzureStorage(BlobString, containerName, logger);
});

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
        .AddRoles<IdentityRole>()
        .AddEntityFrameworkStores<LoanApplicationDbContext>()
        .AddDefaultTokenProviders();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

builder.Services.AddScoped<IUserService, UserService>();



//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options =>
//    {
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = true,
//            ValidateAudience = true,
//            ValidateLifetime = true,
//            ValidateIssuerSigningKey = true,
//            ValidIssuer = builder.Configuration["Jwt:Issuer"],
//            ValidAudience = builder.Configuration["Jwt:Audience"], // Change this to the appropriate audience
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
//        };
//    });

builder.Services.AddControllers();

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
//    c =>
//{
//    c.SwaggerDoc("v1", new OpenApiInfo { Title = "LoginAuth", Version = "v1" });
//}
);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

    // Create roles if they don't exist
    if (!await roleManager.RoleExistsAsync("admin"))
    {
        await roleManager.CreateAsync(new IdentityRole("admin"));
    }

    if (!await roleManager.RoleExistsAsync("user"))
    {
        await roleManager.CreateAsync(new IdentityRole("user"));
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(
        c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "LoginAuth v1")
        );
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors();


// Add authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
Console.WriteLine("bye");

app.Run();
