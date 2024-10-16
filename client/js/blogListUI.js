import { createBlog, getAllBlogs } from "./blogDomain.js";

const generateBlogListElement = (blog) => {};

const renderBlogs = async () => {
  const blogs = await getAllBlogs();
  console.log(blogs);
};

const setupCreateBlogForm = () => {
  const formElement = document.getElementById("createBlogForm");
  formElement.addEventListener("submit", async (e) => {
    e.preventDefault();
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
