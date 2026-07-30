import multer from "multer"

const storage = multer.memoryStorage()

const upload = multer({storage:storage}, {limit:{fileSize:1024 * 1024 * 10}});

export default upload;