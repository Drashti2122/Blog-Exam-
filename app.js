const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const globalErrorHandler = require('./controllers/errorController')
const userRouter = require('./routes/userRoutes')
const topicRouter = require('./routes/topicRoutes')
const blogRouter = require('./routes/blogRoutes')
const commentRouter = require('./routes/commentRoutes')
const likeRouter = require('./routes/likeRoutes')
const dislikeRouter = require('./routes/dislikeRoutes')
const AppError = require('./utils/appError')

app.use(morgan('dev'));
console.log(process.env.NODE_ENV)
//Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP,Please try again in an hour!'
})
app.use('/api', limiter);

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/topics', topicRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/dislikes', dislikeRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler)
    
module.exports = app;