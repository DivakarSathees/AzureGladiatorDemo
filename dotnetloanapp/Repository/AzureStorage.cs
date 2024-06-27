using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using BookStoreDBFirst.Models;
using BookStoreDBFirst.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Azure.Storage.Blobs.Specialized;
using Azure;

namespace BookStoreDBFirst.Repository
{
    public class AzureStorage : IAzureStorage
    {
        private readonly string _connectionstring;
        private readonly string _storageConnectionString;
        private readonly string _storageContainerName;
        private readonly BlobServiceClient _blobServiceClient;
        private readonly ILogger<AzureStorage> _logger;

        // Constructor using IConfiguration
        public AzureStorage(IConfiguration configuration, ILogger<AzureStorage> logger)

        {
            _storageConnectionString = configuration.GetConnectionString("BlobConnectionString");   
            _storageContainerName = configuration.GetValue<string>("BlobContainerName");
            _logger = logger;
            _blobServiceClient = new BlobServiceClient(_storageConnectionString);
        }

        // Constructor using explicit parameters
        public AzureStorage(string storageConnectionString, string storageContainerName, ILogger<AzureStorage> logger)
        {
            _storageConnectionString = storageConnectionString;
            _storageContainerName = storageContainerName;
            _logger = logger;
            _blobServiceClient = new BlobServiceClient(_storageConnectionString);
        }

        [HttpGet("list")]
        public async Task<List<BlobDto>> ListAsync()
        {
            try
            {
                // Get a reference to a container named in appsettings.json
                BlobContainerClient container = _blobServiceClient.GetBlobContainerClient(_storageContainerName);

                // Create a new list object for 
                List<BlobDto> files = new List<BlobDto>();

                await foreach (BlobItem blobItem in container.GetBlobsAsync())
                {
                    var blobClient = container.GetBlobClient(blobItem.Name);
                    var blobProperties = await blobClient.GetPropertiesAsync();

                    files.Add(new BlobDto
                    {
                        Uri = blobClient.Uri.ToString(),
                        Name = blobItem.Name,
                        ContentType = blobProperties.Value.ContentType
                    });
                }

                // Return all files to the requesting method
                return files;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error listing blobs: {ex.Message}");
                throw;
            }
        }

        public async Task<BlobProperties?> GetBlobAsync(string blobName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(_storageContainerName);

            if (await containerClient.ExistsAsync())
            {
                var blobClient = containerClient.GetBlobClient(blobName);

                if (await blobClient.ExistsAsync())
                {
                    // Blob exists, return BlobProperties (metadata about the blob)
                    BlobProperties blobProperties = (await blobClient.GetPropertiesAsync()).Value;

                    return blobProperties;
                }
            }

            // Blob doesn't exist
            return null;
        }

        public async Task<BlobResponseDto> UploadAsync(List<IFormFile> files)
        {
            var responseDto = new BlobResponseDto { Blobs = new List<BlobDto>() };

            foreach (var file in files)
            {
                if (file == null || file.Length == 0)
                {
                    responseDto.Error = true;
                    responseDto.Status = "File is required";
                    return responseDto;
                }

                try
                {
                    var containerClient = _blobServiceClient.GetBlobContainerClient(_storageContainerName);

                    // Generate a unique filename or use the original filename
                    var fileName = $"{Guid.NewGuid().ToString()}_{Path.GetFileName(file.FileName)}";

                    var blobClient = containerClient.GetBlobClient(fileName);

                    using (var stream = file.OpenReadStream())
                    {
                        var blobResponse = await blobClient.UploadAsync(stream, true);
                        if (blobResponse.GetRawResponse().Status != 201)
                        {
                            responseDto.Error = true;
                            responseDto.Status = "Error uploading file to Azure Blob Storage";
                            return responseDto;
                        }
                    }

                    var filePath = blobClient.Uri.ToString();
                    var blobDto = new BlobDto { FilePath = filePath };
                    responseDto.Blobs.Add(blobDto);
                }
                catch (Exception ex)
                {
                    responseDto.Error = true;
                    responseDto.Status = $"Error uploading file: {ex.Message}";
                    return responseDto;
                }
            }

            responseDto.Error = false;
            responseDto.Status = "Files uploaded successfully";
            return responseDto;
        }

        [HttpPost("upload")]
        public async Task<BlobResponseDto> UploadAsync1(IFormFile blob)
        {
            BlobResponseDto response = new BlobResponseDto();

            try
            {
                // Get a reference to the BlobServiceClient using the connection string
                BlobServiceClient blobServiceClient = new BlobServiceClient(_storageConnectionString);

                // Get a reference to the container
                BlobContainerClient container = blobServiceClient.GetBlobContainerClient(_storageContainerName);


                // Get a reference to the blob
                BlobClient client = container.GetBlobClient(blob.FileName);

                // Open a stream for the file we want to upload
                await using (Stream data = blob.OpenReadStream())
                {
                    // Upload the file async
                    await client.UploadAsync(data);
                }
                Console.WriteLine("nameeeee "+ blob.FileName);

                // Everything is OK, and the file got uploaded
                response.Status = $"File {blob.FileName} Uploaded Successfully";
                response.Error = false;
                response.Blob = new BlobDto();
                response.Blob.Uri = client.Uri.AbsoluteUri;
                //response.Blob.Name = client.Name;
                //response.Blob.FilePath = client.;
                response.Blob.FilePath = client.Uri.LocalPath;
                Console.WriteLine("diva " + response.Blob.FilePath);
                Console.WriteLine("URI " + response.Blob.Uri);

            }
            catch (RequestFailedException ex) when (ex.ErrorCode == BlobErrorCode.BlobAlreadyExists)
            {
                _logger.LogError($"File with name {blob.FileName} already exists in the container: {_storageContainerName}");
                response.Status = $"File with name {blob.FileName} already exists. Please use another name.";
                response.Error = true;
            }
            catch (RequestFailedException ex)
            {
                _logger.LogError($"Unhandled Exception. ID: {ex.StackTrace} - Message: {ex.Message}");
                response.Status = $"Unexpected error: {ex.StackTrace}. Check log with StackTrace ID.";
                response.Error = true;
            }

            return response;
        }

        Task<BlobDto> IAzureStorage.GetBlobAsync(string fileName)
        {
            throw new NotImplementedException();
        }
    }
}
