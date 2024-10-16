import { createBlogInApi, getAllBlogsFromApi } from "./blogService.js";

var blogs = [];

export const getAllBlogs = async () => {
  blogs = await getAllBlogsFromApi();
  return blogs.map((blog) => ({ ...blog }));
};

// paragraphs needs to be an array of strings
export const createBlog = async (author, title, paragraphs) => {
  await createBlogInApi({
    title,
    author,
    paragraphs,
    id: Date.now(),
  })
};
