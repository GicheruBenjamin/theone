// tests.js

import { getapidata } from "./services.js";
import {
    loginuser,
    getuserpostsandcomments,
    getusertodos,
    getuseralbumsandphotos
} from "./dataprocessing.js";

export async function runTests() {
    console.log("Fetching API data...");

    const usersRes = await getapidata("users");
    const postsRes = await getapidata("posts");
    const commentsRes = await getapidata("comments");
    const todosRes = await getapidata("todos");
    const albumsRes = await getapidata("albums");
    const photosRes = await getapidata("photos");

    if (
        !usersRes.ok ||
        !postsRes.ok ||
        !commentsRes.ok ||
        !todosRes.ok ||
        !albumsRes.ok ||
        !photosRes.ok
    ) {
        console.error("One or more API calls failed");
        return;
    }

    console.log("API data fetched successfully");

    const logindata = {
        username: "Bret",
        email: "Sincere@april.biz"
    };

    const loginRes = await loginuser(logindata, usersRes.data);
    console.log("Login Result:", loginRes);

    if (!loginRes.ok) return;

    const userId = loginRes.data.id;

    console.log(
        "Posts & Comments:",
        await getuserpostsandcomments(
            userId,
            postsRes.data,
            commentsRes.data
        )
    );

    console.log(
        "Todos:",
        await getusertodos(userId, todosRes.data)
    );

    console.log(
        "Albums & Photos:",
        await getuseralbumsandphotos(
            userId,
            albumsRes.data,
            photosRes.data
        )
    );
}
