import fs from "fs/promises"; // Import the promise-based version
export const deleteImage = async (imagePath) => {
    try {
        await fs.unlink(imagePath); // This works with fs/promises
        console.log(`Image deleted: ${imagePath}`);
    }
    catch (error) {
        // Handle the unknown type error
        if (error instanceof Error) {
            console.error(`Error deleting image: ${error.message}`);
        }
        else {
            console.error(`Error deleting image: ${String(error)}`);
        }
    }
};
