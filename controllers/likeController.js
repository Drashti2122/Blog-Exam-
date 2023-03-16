const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Likes = require('./../models/likeModel');
const DisLikes = require('./../models/dislikeModel');
const Blog = require('./../models/blogModel');
const mongoose = require('mongoose')

/*
 * req:request for create user like // remove user like // remove from the like,and insert inside dislike
 * res:get back response from api request
 * next:is middleware
 */
exports.aboutLike = catchAsync(async (req, res, next) => {
    const user = req.user.id;
    checkBlog = await Blog.findOne({ _id: req.body.blog });
    if (checkBlog) {
        const checkLike = await Likes.findOne({ user: user, blog: req.body.blog })
        const checkDisLike = await DisLikes.findOne({ user: user, blog: req.body.blog })

        if (checkLike) {
            const removeLike = await Likes.deleteOne({ user: user, blog: req.body.blog })
            console.log(removeLike)
            res.status(200).json({
                statusCode: 200,
                status: "success",
                message: "Remove your like"
            })
        } else if (checkDisLike) {
            const removeLike = await DisLikes.deleteOne({ user: user, blog: req.body.blog })
            console.log(removeLike)

            const saveDisLike = await Likes.create({
                user,
                blog: req.body.blog
            });
            res.status(200).json({
                statusCode: 200,
                status: "success",
                message: "Remove from the dislike,and insert inside like",
                data: saveDisLike
            })
        }
        else {
            const saveLike = await Likes.create({
                user,
                blog: req.body.blog
            });
            res.status(200).json({
                statusCode: 200,
                status: "success",
                message: "Your like successfully created",
                data: saveLike
            })
        }
    } else {
        return next(new AppError("No Blog Found with that id.", 404))
    }
})

/*
 * req:request for get most liked blog(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.getMostLikedBlog = catchAsync(async (req, res, next) => {
    let blogId = [];
    let cnt = req.params.lmt ? Number(req.params.lmt) : 5;
    const data = await Likes.aggregate([
        { $group: { _id: "$blog", count: { $sum: Number(1) } } },
        { $limit: cnt },
        { $sort: { count: 1 } }
    ])

    let max = cnt > data.length ? data.length : cnt

    for (let i = 0; i < max; i++) {
        blogId.push(JSON.parse(JSON.stringify(data[i]._id)))
    }

    const blogData = await Blog.find({
        "_id": {
            "$in": blogId
        }
    })
    res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Get Most liked blog",
        data: blogData
    })
})