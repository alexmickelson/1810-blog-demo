using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

var app = builder.Build();

app.UseCors(c =>
    c.AllowAnyHeader()
     .AllowAnyMethod()
     .AllowAnyOrigin());

var storageRoot = "./storage";
if (!Directory.Exists(storageRoot))
{
  Directory.CreateDirectory(storageRoot);
}

// Blog CRUD Endpoints

app.MapGet("/blogs", () =>
{
  var blogs = Directory.GetDirectories(storageRoot)
    .Select(blogDir =>
    {
      var blogFile = Path.Combine(blogDir, "blog.json");
      if (!File.Exists(blogFile)) return null;

      var blog = JsonSerializer.Deserialize<Blog>(File.ReadAllText(blogFile));
      return blog == null ? null : new { blog.Id, blog.Author, blog.Title };
    })
    .Where(b => b != null);

  return Results.Ok(blogs);
});

app.MapGet("/blogs/{id}", (ulong id) =>
{
  var blogFolder = id.ToString();
  var blogFile = Path.Combine(storageRoot, blogFolder, "blog.json");
  if (!File.Exists(blogFile))
    throw new Exception("Blog not found.");

  var blog = JsonSerializer.Deserialize<Blog>(File.ReadAllText(blogFile));
  if (blog == null)
    throw new Exception("Blog not found");

  return blog;
});

app.MapPost("/blogs", async (Blog blog) =>
{
  var blogPath = Path.Combine(storageRoot, blog.Id.ToString());
  Directory.CreateDirectory(blogPath);

  var blogFile = Path.Combine(blogPath, "blog.json");
  await File.WriteAllTextAsync(blogFile, JsonSerializer.Serialize(blog));
});

app.MapPut("/blogs/{id}", async (ulong id, Blog updatedBlog) =>
{
  var blogPath = Path.Combine(storageRoot, id.ToString(), "blog.json");
  if (!File.Exists(blogPath))
    throw new Exception("Blog not found.");

  var newBlog = updatedBlog with { Id = id };
  await File.WriteAllTextAsync(blogPath, JsonSerializer.Serialize(newBlog));
});

app.MapDelete("/blogs/{id}", (ulong id) =>
{
  var blogPath = Path.Combine(storageRoot, id.ToString());
  if (!Directory.Exists(blogPath))
    throw new Exception("Blog not found.");

  Directory.Delete(blogPath, true);
});

// Comment CRUD Endpoints

app.MapGet("/blogs/{blogId}/comments", (ulong blogId) =>
{
  var commentsPath = Path.Combine(storageRoot, blogId.ToString(), "comments");
  if (!Directory.Exists(commentsPath))
    throw new Exception("No comments found.");

  var commentIds = Directory.GetFiles(commentsPath)
      .Select((file) => Path.GetFileNameWithoutExtension(file))
      .Select((fileName) => ulong.Parse(fileName));

  return Results.Ok(commentIds);
});

app.MapGet("/blogs/{blogId}/comments/{commentId}", (ulong blogId, ulong commentId) =>
{
  var commentFile = Path.Combine(storageRoot, blogId.ToString(), "comments", $"{commentId}.json");
  if (!File.Exists(commentFile))
    throw new Exception("Comment not found.");

  var comment = JsonSerializer.Deserialize<Comment>(File.ReadAllText(commentFile));
  return Results.Ok(comment);
});

app.MapPost("/blogs/{blogId}/comments", async (ulong blogId, Comment comment) =>
{
  var commentsPath = Path.Combine(storageRoot, blogId.ToString(), "comments");
  Directory.CreateDirectory(commentsPath);

  var commentFile = Path.Combine(commentsPath, $"{comment.Id}.json");
  await File.WriteAllTextAsync(commentFile, JsonSerializer.Serialize(comment));

  return Results.Created($"/blogs/{blogId}/comments/{comment.Id}", comment);
});

app.MapPut("/blogs/{blogId}/comments/{commentId}", async (ulong blogId, ulong commentId, Comment updatedComment) =>
{
  var commentFile = Path.Combine(storageRoot, blogId.ToString(), "comments", $"{commentId}.json");
  if (!File.Exists(commentFile))
    return Results.NotFound("Comment not found.");

  var newComment = updatedComment with { Id = commentId };
  await File.WriteAllTextAsync(commentFile, JsonSerializer.Serialize(newComment));
  return Results.NoContent();
});

app.MapDelete("/blogs/{blogId}/comments/{commentId}", (ulong blogId, ulong commentId) =>
{
  var commentFile = Path.Combine(storageRoot, blogId.ToString(), "comments", $"{commentId}.json");
  if (!File.Exists(commentFile))
    return Results.NotFound("Comment not found.");

  File.Delete(commentFile);
  return Results.NoContent();
});

app.Run();

public record Blog(ulong Id, string Author, string Title, string[] Paragraphs);
public record Comment(ulong Id, string Author, string Text);
