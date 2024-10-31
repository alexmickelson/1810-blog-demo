const API_URL = "http://localhost:5048";

export const getAllBlogsFromApi = async () => {
  const response = await fetch(`${API_URL}/blogs`);
  if (!response.ok) throw new Error("error getting blogs");
  return await response.json();
};

export const getBlogByIdFromApi = async (id) => {
  const response = await fetch(`${API_URL}/blogs/${id}`);
  if (!response.ok) throw new Error(`error getting blog: ${id}`);
  return await response.json();
};

export const createBlogInApi = async (blog) => {
  const response = await fetch(`${API_URL}/blogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog),
  });
  // if (!response.ok) {
  //   console.log(blog);
  //   throw new Error("error creating blog");
  // }
};

export const updateBlogFromApi = async (id, updatedBlog) => {
  const response = await fetch(`${API_URL}/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedBlog),
  });
  if (!response.ok) {
    console.log(id, updatedBlog);
    throw new Error(`error updating blog`);
  }

};

export const deleteBlogFromApi = async (id) => {
  const response = await fetch(`${API_URL}/blogs/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`error deleting blog: ${id}`);
  }
};
