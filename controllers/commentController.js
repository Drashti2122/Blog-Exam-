const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Comment = require('./../models/commentModel')
const Blog = require('./../models/blogModel')

/*
 * req:request for create comment(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.createComment = catchAsync(async (req, res, next) => {
    const user = req.user;
    const checkBlog = await Blog.findOne({ _id: req.body.blog })
    if (checkBlog) {
        const createComment = await Comment.create({
            comment: req.body.comment,
            user: user._id,
            blog: req.body.blog
        });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Thank you for comment",
            data: createComment
        })
    } else {
        return next(new AppError("Blog not found with that id.", 404))
    }

});

/*
 * req:request for get comment(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.getComment = catchAsync(async (req, res, next) => {
    const getComment = await Comment.find({ blog: req.params.id });

    if (!getComment) {
        return next(new AppError("No comment found"))
    }

    res.status(200).json({
        statusCode: 200,
        status: "success",
        message: `Comment of ${getComment.title}`,
        data: getComment
    });
});