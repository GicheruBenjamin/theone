// src/services/fetch.js

const BASEURL = "https://jsonplaceholder.typicode.com";

async function request(endpoint) {
  const response = await fetch(`${BASEURL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export const getUsers = () => request("/users");

export const getPosts = (userId) =>
  userId ? request(`/posts?userId=${userId}`) : request("/posts");

export const getComments = (postId) =>
  postId ? request(`/comments?postId=${postId}`) : request("/comments");

export const getTodos = (userId) =>
  userId ? request(`/todos?userId=${userId}`) : request("/todos");

export const getAlbums = (userId) =>
  userId ? request(`/albums?userId=${userId}`) : request("/albums");

export const getPhotos = (albumId) =>
  albumId ? request(`/photos?albumId=${albumId}`) : request("/photos");
