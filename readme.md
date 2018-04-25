# Angular fine uploader
A simple angularjs directive based on Fine-Uploader.

### Functions
- upload-service-url: Your endpoint to upload the file
- delete-file-service-url: Your endpoint to delete the file
- on-success-upload-callback: Your callback function after successful upload
- max-size-kb: maximum allowed file size to upload
- max-allowed-items: Maximum allowed files to upload 
- allowed-extensions: Allowed file extensions for uploading the files like 'jpeg,jpg,gif,png,pdf,js'

### Attention
- See the usage in demo project

Sample server side code for C# :
```
    [HttpPost]
    public async Task<FileUploaderResult> UploadFile()
    {
        var folderName = "uploads";
        var PATH = HttpContext.Current.Server.MapPath("~/" + folderName);
        var rootUrl = Request.RequestUri.AbsoluteUri.Replace(Request.RequestUri.AbsolutePath, String.Empty);
        if (Request.Content.IsMimeMultipartContent())
        {
            var streamProvider = new CustomMultipartFormDataStreamProvider(PATH);
            var task = Request.Content.ReadAsMultipartAsync(streamProvider).ContinueWith<FileUploaderResult>(t =>
            {
                if (t.IsFaulted || t.IsCanceled)
                {
                    throw new HttpResponseException(HttpStatusCode.InternalServerError);
                }

                var fileInfo = streamProvider.FileData.Select(i => {
                    var info = new FileInfo(i.LocalFileName);
                    return new FileUploaderResult(info.Name, rootUrl + "/" + folderName + "/" + info.Name, info.Length / 1024, true);
                }).First();
                return fileInfo;
            });

            return await task;
        }
        else
        {
            throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotAcceptable, "This request is not properly formatted"));
        }
    }

    [HttpDelete]
    public async Task DeleteFile(Guid id)
    {
        await myBusiness.DeleteFileAsync(id);
    }
```

and your CustomMultipartFormDataStreamProvider class looks like this:
```
    public class CustomMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
    {
        public CustomMultipartFormDataStreamProvider(string path) : base(path)
        {
        }

        public override string GetLocalFileName(System.Net.Http.Headers.HttpContentHeaders headers)
        {
            var name = !string.IsNullOrWhiteSpace(headers.ContentDisposition.FileName) ? headers.ContentDisposition.FileName : "NoName";
            return name.Replace("\"", string.Empty); //this is here because Chrome submits files in quotation marks which get treated as part of the filename and get escaped
        }
    }
```

and your FileUploadReault class looks like this:
```
    public class FileUploaderResult
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public long Size { get; set; }
        public bool Success { get; set; }

        public FileUploaderResult(string name, string path, long size, bool success)
        {
            Name = name;
            Path = path;
            Size = size;
            Success = success;
        }
    }
```