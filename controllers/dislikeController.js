const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const DisLikes = require('./../models/dislikeModel');
const Likes = require('./../models/likeModel');
const Blog = require('./../models/blogModel')

/*
 * req:request for create user dislike // remove user dislike // remove from the like,and insert inside dislike
 * res:get back response from api request
 * next:is middleware
 */
exports.aboutDislike = catchAsync(async (req, res, next) => {
    const user = req.user.id;
    const checkDisLike = await DisLikes.findOne({ user: user, blog: req.body.blog })
    const checkLike = await Likes.findOne({ user: user, blog: req.body.blog })
    checkBlog = await Blog.findOne({ _id: req.body.blog });
    if (checkBlog) {
        if (checkDisLike) {
            const removeLike = await DisLikes.deleteOne({ user: user, blog: req.body.blog })
            console.log(removeLike)
            res.status(200).json({
                statusCode: 200,
                status: "success",
                message: "Remove your dislike",
            })
        } else if (checkLike) {
            const removeLike = await Likes.deleteOne({ user: user, blog: req.body.blog })

            const saveLike = await DisLikes.create({
                user,
                blog: req.body.blog
            });
            res.status(200).json({
                statusCode: 200,
                status: "success",
                message: "Remove from the like,and insert inside dislike",
                data: saveLike
            })
        }
        else {
            const saveDisLike = await DisLikes.create({
                user,
                blog: req.body.blog
            });
            res.status(200).json({
                statusCode: 200,
                status: "success",
                message: "Your dislike successfully created",
                data: saveDisLike
            })
        }
    } else {
        return next(new AppError("No blog found with that id.", 404))
    }
})