// Photos.js : Responsible for generating photo URLs from Lorem Picsum
const BASE_URL = "https://picsum.photos";

export default function getPhotoUrl(width, height, seed = null) {
    try {
        // Validate input
        if (!Number.isInteger(width) || !Number.isInteger(height)) {
            return {
                ok: false,
                message: "Width and height must be integers",
                data: null
            };
        }

        const url = seed
            ? `${BASE_URL}/seed/${seed}/${width}/${height}`
            : `${BASE_URL}/${width}/${height}`;

        return {
            ok: true,
            message: "Photo URL generated successfully",
            data: url
        };

    } catch (e) {
        return {
            ok: false,
            message: `Generating photo URL failed with error: ${e.message}`,
            data: null
        };
    }
}
