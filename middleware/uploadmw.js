const multer = require("multer");
const path = require("path")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now().toString() + path.extname(file.originalname)
        cb(null, uniqueSuffix)
    }
})
const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const uploadHandler = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadHandler;


