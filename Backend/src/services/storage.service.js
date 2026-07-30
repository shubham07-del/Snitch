import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js';
import upload from '../middlewares/upload.middleware.js';

const client = new ImageKit({
    privateKey:config.IMAGEKIT_PRIVATE_KEY
})

export const uploadFile = async ({buffer, fileName, folder="Snitch"}) => {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result
}