const multer = require('multer')
const sharp = require('sharp');
const fs = require('fs')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Blog = require('./../models/blogModel')
const Topic = require('./../models/topicModel')
const Comment = require('./../models/commentModel')
const Like = require('./../models/likeModel')
const DisLike = require('./../models/dislikeModel')
const User = require('./../models/userModel')
const Email = require('./../utils/email')

const multerStorage = multer.memoryStorage()
/*
 * req:contain file,that user request to upload
 * res:get back response from api request
 * cb:is like middleware
 */
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError("Not an image!Please upload only images.", false))
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadBlogImages = upload.fields([
    { name: 'images', maxCount: 3 }
]);

/*
 * req:request for create blog(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    // console.log(req.files.images)
    if (!req.files.images) return next();

    req.body.images = [];
    await Promise.all(
        req.files.images.map(async (file, i) => {
            const ext = req.files.images[i].mimetype.split('/')[1];
            const filename = `user-${req.user.id}-${Date.now()}-${i + 1}.${ext}`;
            await sharp(req.files.images[i].buffer).resize(1000, 1000).toFile(`public/img/users/${filename}`);
            req.body.images.push(filename)
        })
    );
    next();
});


/*
 * req:request for create blog(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.createBlog = catchAsync(async (req, res, next) => {
    // console.log(req.file)
    // console.log(req.body)
    const user = req.user;
    const checkTopic = await Topic.find({ _id: req.body.topic })
    if (checkTopic) {
        const saveBlog = await Blog.create({
            title: req.body.title,
            description: req.body.description,
            images: req.body.images,
            user: user._id,
            topic: req.body.topic
        });

        const userCount = await User.find().count();
        const getAllUser = await User.find();
        for (let i = 0; i < userCount; i++) {
            const url = `${req.protocol}://${req.get('host')}/createBlog`;
            await new Email(getAllUser[0], url).sendNewBlogNotification();
        }

        res.status(201).json({
            statusCode: 201,
            status: 'success',
            message: 'Blog successfully created',
            data: saveBlog
        })
    } else {
        return next(new AppError("Topic not found with that id.", 404))
    }

});

/*
 * req:request for get blog(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.getBlog = catchAsync(async (req, res, next) => {
    const result = await Blog.find();
    if (!result) {
        return next(new AppError("Blog not found.", 404))
    } else {
        res.status(201).json({
            statusCode: 201,
            status: 'success',
            message: "Get all data of blog",
            data: result
        })
    }
})

/*
 * req:request for delete blog(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.deleteBlog = catchAsync(async (req, res, next) => {
    let blogID = await Blog.find({ _id: req.params.id }).select('_id')
    if (!blogID) {
        return next(new AppError('No document found with that id.', 404))
    }

    const getBlogimages = await Blog.findOne({ _id: req.params.id }).select('images');
    const cnt = getBlogimages.images.length;
    for (let i = 0; i < cnt; + i++) {
        fs.unlink(`public/img/users/${getBlogimages.images[i]}`, function (err) {
            if (err) {
                return next(new AppError('somthing wrong,when you delete files.', 404))
            } else {
                console.log("Successfully deleted the file.")
            }
        })
    }

    let commentID = await Comment.find({ blog: blogID });
    let likeID = await Like.find({ blog: blogID });
    let disLikeID = await DisLike.find({ blog: blogID });
    if (commentID) {
        commentDelete = await Comment.deleteMany({ blog: blogID })
    }
    if (likeID) {
        likeDelete = await Like.deleteMany({ blog: blogID })
    }
    if (disLikeID) {
        dislikeDelete = await DisLike.deleteMany({ blog: blogID })
    }

    blogDelete = await Blog.findByIdAndDelete({ _id: req.params.id })

    res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Blog successfully deleted",
        data: blogDelete
    })
})

/*
 * req:request for edit blog(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.editBlog = catchAsync(async (req, res, next) => {
    const checkTopic = await Topic.find({ _id: req.body.topic })
    const getBlogimages = await Blog.findOne({ _id: req.params.id }).select('images');
    const cnt = getBlogimages.images.length;
    for (let i = 0; i < cnt; + i++) {
        fs.unlink(`public/img/users/${getBlogimages.images[i]}`, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log("Successfully deleted the file.")
            }
        })
    }
    if (checkTopic) {

        const result = await Blog.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            images: req.body.images,
            topic: req.body.topic
        },
            {
                new: true,
                runValidators: true
            })

        if (!result) {
            return next(new AppError('No document found with that id.', 404))
        }
        res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: "Blog successfully updated",
        })
    } else {
        return next(new AppError("Topic not found with that id.", 404))
    }
})

/*
 * req:request for get blog by topic(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.getBlogByTopic = catchAsync(async (req, res, next) => {
    const data = await Blog.find({ topic: req.params.id })

    if (!data) {
        return next(new AppError('No data found with that id.', 404))
    } else {
        res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: "Get blog by topic",
            data: data
        })
    }
})

/*
 * req:request for get most recent blog(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.getMostRecentBlog = catchAsync(async (req, res, next) => {
    const data = await Blog.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: Number(req.params.cnt) }
    ]);
    if (!data) {
        return next(new AppError('No data found.', 404))
    } else {
        res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: "Get most recent topic",
            data: data
        })
    }
})

