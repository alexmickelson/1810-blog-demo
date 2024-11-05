import { getBlogByIdFromApi } from "./blogService.js";
import { createCommentOnApi, getAllCommentsFromApi } from "./commentService.js";

const getBlogIdFromQueryString = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get("id");
  return blogId;
};

const renderBlog = async () => {
  const blogId = getBlogIdFromQueryString();
  const blog = await getBlogByIdFromApi(blogId);
  console.log(blog);

  const blogContainer = document.getElementById("blogContentContainer");
  blogContainer.replaceChildren();

  const titleElement = document.createElement("h1");
  titleElement.textContent = blog.title;
  blogContainer.appendChild(titleElement);

  const authorElement = document.createElement("h3");
  authorElement.textContent = blog.author;
  blogContainer.appendChild(authorElement);

  const paragraphElements = blog.paragraphs.map((p) => {
    const element = document.createElement("p");
    element.textContent = p;
    return element;
  });
  blogContainer.append(...paragraphElements);
};

const setupCommentForm = () => {
  const formElement = document.getElementById("commentsContainer");
  formElement.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameElement = document.getElementById("commentNameInput");
    const textElement = document.getElementById("commentTextInput");
    const blogId = getBlogIdFromQueryString();
    const comment = {
      id: Date.now(),
      author: nameElement.value,
      text: textElement.value,
    };
    await createCommentOnApi(blogId, comment);
    await renderComments();
  });
};

const renderComments = async () => {
  const commentListElement = document.getElementById("commentsList");
  const blogId = getBlogIdFromQueryString();
  const comments = await getAllCommentsFromApi(blogId);
  console.log("coments", comments);

  const commentElements = comments.map((c) => {
    const commentElement = document.createElement("div");
    const commentAuthorElement = document.createElement("h5");
    const commentTextElement = document.createElement("p");
    commentElement.append(commentAuthorElement, commentTextElement);

    commentElement.classList.add("comment")
    commentAuthorElement.textContent = c.author;
    commentTextElement.textContent = c.text;
    return commentElement;
  });

  commentListElement.replaceChildren(...commentElements);
};

renderBlog();
setupCommentForm();
renderComments();
