// dataprocessing.js

export async function loginuser(logindata, users){
 // Users is a list of objects 
 // logindata is an object with username and email
 // find the user with the email and username
 // if found, return the {ok:true , message:"Login successful", data:user}
 // if not found, return {ok:false, message:"Login failed", data:null}
    const { username, email } = logindata;

    // find user with matching username and email
    const user = users.find(
        u => u.username === username && u.email === email
    );

    if (user) {
        return {
            ok: true,
            message: "Login successful",
            data: user
        };
    }

    return {
        ok: false,
        message: "Login failed",
        data: null
    };

}

export async function getuserpostsandcomments(userId,posts,comments) {
    // posts and comments are lists of objects
    // userId is the id of the user
    // return {ok:true, message:"Success", data:{posts of that iserId and comments of that postId}}
    // return {ok:false, message:"Failed", data:null}

    const userPosts = posts.filter(post => post.userId === userId);

    // if no posts found, fail
    if (userPosts.length === 0) {
        return {
            ok: false,
            message: "Failed",
            data: null
        };
    }

    // attach comments to each post
    const result = userPosts.map(post => ({
        ...post,
        comments: comments.filter(comment => comment.postId === post.id)
    }));

    return {
        ok: true,
        message: "Success",
        data: result
    };
}

export async function getusertodos(userId,todos) {  
    // todos is a list of objects
    // userId is the id of the user
    // return {ok:true, message:"Success", data:{todos of that userId}}
    // return {ok:false, message:"Failed", data:null}

    const userTodos = todos.filter(todo => todo.userId === userId);

    // if no todos found, fail
    if (userTodos.length === 0) {
        return {
            ok: false,
            message: "Failed",
            data: null
        };
    }

    return {
        ok: true,
        message: "Success",
        data: userTodos
    };

}

export async function getuseralbumsandphotos(userId,albums,photos) {
    // albums and photos are lists of objects
    // userId is the id of the user
    // return {ok:true, message:"Success", data:{albums of that userId and photos of that albumId}}
    // return {ok:false, message:"Failed", data:null}

    const userAlbums = albums.filter(album => album.userId === userId);

    // if no albums found, fail
    if (userAlbums.length === 0) {
        return {
            ok: false,
            message: "Failed",
            data: null
        };
    }

    // attach photos to each album
    const result = userAlbums.map(album => ({
        ...album,
        photos: photos.filter(photo => photo.albumId === album.id)
    }));

    return {
        ok: true,
        message: "Success",
        data: result
    };
}