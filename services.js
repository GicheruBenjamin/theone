// services.js

/*
1. getUserOverview(userId)
2. getUserPostsandComments(userId)
3. getUserTodos(userId)
4. getUserAlbumsandPhotos(userId)
*/

import { getapidata } from "./api.js"


export async function getUserOverview(userId) {
    if (!userId) {
      return {
        ok: false,
        message: "User ID required",
        data: null
      };
    }
  
    try {
      // Fetch everything in parallel (much faster)
      const [
        postsres,
        commentsres,
        todosres,
        albumsres,
        photosres
      ] = await Promise.all([
        getApiData("posts"),
        getApiData("comments"),
        getApiData("todos"),
        getApiData("albums"),
        getApiData("photos")
      ]);
  
      // Check errors
      const responses = [
        postsres,
        commentsres,
        todosres,
        albumsres,
        photosres
      ];
  
      const failed = responses.find(r => !r.ok);
      if (failed) return failed;
  
      const posts = postsres.data.filter(p => p.userId === userId);
      const todos = todosres.data.filter(t => t.userId === userId);
      const albums = albumsres.data.filter(a => a.userId === userId);
  
      // comments belong to posts
      const userPostIds = posts.map(p => p.id);
  
      const comments = commentsres.data.filter(c =>
        userPostIds.includes(c.postId)
      );
  
      // photos belong to albums
      const userAlbumIds = albums.map(a => a.id);
  
      const photos = photosres.data.filter(p =>
        userAlbumIds.includes(p.albumId)
      );
  
      return {
        ok: true,
        message: "User overview fetched successfully",
        data: {
          id: userId,
          postscount: posts.length,
          commentscount: comments.length,
          todoscount: todos.length,
          albumscount: albums.length,
          photoscount: photos.length
        }
      };
  
    } catch (e) {
      return {
        ok: false,
        message: e.message,
        data: null
      };
    }
  }


  export async function getUserPostsandComments(userId) {
    if (!userId) {
      return {
        ok: false,
        message: "User ID required",
        data: null
      };
    }
  
    try {
      // Fetch both in parallel (faster)
      const [postsres, commentsres] = await Promise.all([
        getApiData("posts"),
        getApiData("comments")
      ]);
  
      if (!postsres.ok || !commentsres.ok) {
        return {
          ok: false,
          message: postsres.message || commentsres.message,
          data: null
        };
      }
  
      const posts = postsres.data;
      const comments = commentsres.data;
  
      // Get all posts for this user
      const userposts = posts
        .filter(post => post.userId === userId)
        .map(post => {
          // Get comments for each post
          const postComments = comments.filter(
            comment => comment.postId === post.id
          );
  
          return {
            ...post,
            comments: postComments
          };
        });
  
      return {
        ok: true,
        message: "User posts and comments fetched successfully",
        data: userposts
      };
  
    } catch (e) {
      return {
        ok: false,
        message: e.message,
        data: null
      };
    }
  }

  export async function getUserTodos(userId) {
    if (!userId) {
      return { ok:false, message:"User ID required", data:null };
    }
  
    try {
      const todosres = await getApiData("todos");
      if (!todosres.ok) return todosres;
  
      const usertodos = todosres.data.filter(
        todo => todo.userId === userId
      );
  
      return {
        ok: true,
        message: "User todos fetched successfully",
        data: usertodos
      };
  
    } catch (e) {
      return { ok:false, message:e.message, data:null };
    }
  }
  
  export async function getUserAlbumsandPhotos(userId) {
    if (!userId) {
      return { ok:false, message:"User ID required", data:null };
    }
  
    try {
      const [albumsres, photosres] = await Promise.all([
        getApiData("albums"),
        getApiData("photos")
      ]);
  
      if (!albumsres.ok || !photosres.ok) {
        return albumsres.ok ? photosres : albumsres;
      }
  
      const albums = albumsres.data.filter(a => a.userId === userId);
  
      const albumIds = new Set(albums.map(a => a.id));
  
      const userAlbums = albums.map(album => ({
        ...album,
        photos: photosres.data.filter(p => albumIds.has(p.albumId))
      }));
  
      return {
        ok: true,
        message: "User albums and photos fetched successfully",
        data: userAlbums
      };
  
    } catch (e) {
      return { ok:false, message:e.message, data:null };
    }
  }
  