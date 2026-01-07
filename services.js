// services.js
const url = "https://jsonplaceholder.typicode.com";

export async function getapidata(label) {
    try {
        const res = await fetch(`${url}/${label}`);

        if (!res.ok) {
            return {
                ok: false,
                message: `Fetching ${label} failed (${res.status} ${res.statusText})`,
                data: null
            };
        }

        const data = await res.json();

        return {
            ok: true,
            message: `Fetched ${label} successfully`,
            data
        };

    } catch (e) {
        return {
            ok: false,
            message: `Fetching ${label} failed with error: ${e.message}`,
            data: null
        };
    }
}
