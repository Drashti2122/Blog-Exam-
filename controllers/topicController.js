const catchAsync = require("../utils/catchAsync");
const Topic = require("./../models/topicModel");
const AppError = require("./../utils/appError")
const Blog = require("./../models/blogModel")
const Comment = require("./../models/commentModel")
const Like = require("./../models/likeModel")
const DisLike = require("./../models/dislikeModel")

/*
 * req:request for create topic(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.createTopic = catchAsync(async (req, res, next) => {
    const user = req.user;
    const saveTopic = await Topic.create({
        topicName: req.body.topicName,
        topicDes: req.body.topicDes,
        user: user._id
    });
    res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: "Topic successfully created",
        data: saveTopic
    })
});

/*
 * req:request for get topic(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.getTopic = catchAsync(async (req, res, next) => {
    const result = await Topic.find();
    if (!result) {
        return next(new AppError('Topic not found.', 401))
    } else {
        res.status(201).json({
            status: 'success',
            statusCode: 201,
            message: "Get all data of topic",
            data: result
        })
    }
})

/*
 * req:request for delete topic(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.deleteTopic = catchAsync(async (req, res, next) => {
    let blogID = await Blog.find({ topic: req.params.id }).select('_id')
    //console.log(blogID)
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
    if (blogID) {
        blogDelete = await Blog.deleteMany({ _id: blogID })
    }
    topicDelete = await Topic.findByIdAndDelete({ _id: req.params.id })
    if (!topicDelete) {
        return next(new AppError('Topic id not found.', 401))
    }
    res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Topic successfully deleted",
        data: topicDelete
    })
});