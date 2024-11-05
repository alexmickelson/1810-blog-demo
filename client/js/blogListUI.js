import { createBlog, getAllBlogs } from "./blogDomain.js";

const generateBlogListElement = (blog) => {
  const blogItemElement = document.createElement("a");

  blogItemElement.setAttribute("href", `/blog.html?id=${blog.id}`)

  blogItemElement.textContent = `${blog.title} - ${blog.author}`;
  blogItemElement.classList.add("blogListItem")
  return blogItemElement;
};

const renderBlogs = async () => {
  const blogs = await getAllBlogs();
  console.log(blogs);
  const blogElements = blogs.map((b) => generateBlogListElement(b));

  const blogContainer = document.getElementById("blogListContainer");
  blogContainer.replaceChildren(...blogElements);
};

const setupCreateBlogForm = () => {
  const formElement = document.getElementById("createBlogForm");
  formElement.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const authorElement = document.getElementById("blogAuthor");
    const titleElement = document.getElementById("blogTitle");
    const paragraphsElement = document.getElementById("blogParagraphs");

    await createBlog(
      authorElement.value,
      titleElement.value,
      paragraphsElement.value.split("\n")
    );
    await renderBlogs();
  });
};

setupCreateBlogForm();
renderBlogs();
