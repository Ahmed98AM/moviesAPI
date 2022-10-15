const multer = require("multer");
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype?.split('/').includes('image')) {
        req.invalidImgType = false;
        cb(null, true);
    } else {
        req.invalidImgType = true;
        cb(null, false);
    }
};
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});
const convert = async (req, res, next) => {
    if (req.invalidImgType) return next(new AppError("Invalid image type", 415));
    if (!req.file) return next();
    originalName = req.file.originalname.split('.');
    const imageExt = originalName[1];
    req.file.filename = `image-${Date.now()}.${imageExt}`;
    next();
};
module.exports = {upload, convert};