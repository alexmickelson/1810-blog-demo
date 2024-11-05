const API_URL = "http://localhost:5048";

export const getAllCommentsFromApi = async (blogId) => {
  const response = await fetch(`${API_URL}/blogs/${blogId}/comments`);
  if (!response.ok) throw new Error(`error getting comments for blog: ${blogId}`);
  return await response.json();
};

export const getCommentByIdFromApi = async (blogId, commentId) => {
  const response = await fetch(`${API_URL}/blogs/${blogId}/comments/${commentId}`);
  if (!response.ok) throw new Error(`error getting comment: ${commentId}`);
  return await response.json();
};

export const createCommentOnApi = async (blogId, comment) => {
  const response = await fetch(`${API_URL}/blogs/${blogId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });
  if (!response.ok) {
    console.log(blogId, comment);
    throw new Error(`error creating comment`);
  }
};

export const updateCommentFromApi = async (blogId, commentId, updatedComment) => {
  const response = await fetch(`${API_URL}/blogs/${blogId}/comments/${commentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedComment),
  });
  if (!response.ok) {
    console.log(blogId, commentId, updatedComment);
    throw new Error(`error updating comment: ${commentId}`);
  }
};

export const deleteCommentFromApi = async (blogId, commentId) => {
  const response = await fetch(`${API_URL}/blogs/${blogId}/comments/${commentId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`error deleting comment: ${commentId}`);
  }
};
