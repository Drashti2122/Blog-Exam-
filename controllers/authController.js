const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const User = require('./../models/userModel')
const Email = require('../utils/email')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')

/*
 * id:id of user,which want to login or register
 */
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

/*
 * user:data of user,which want to login or register)
 * statusCode:it gives statuscode according to response
 * res:get back response from api request
 * message:it gives message according to request(request either login or register)
 */

const createSendToken = (user, statusCode, res, message) => {
    const token = signToken(user._id)
    if (token) {
        res.status(statusCode).json({
            status: "success",
            statusCode,
            message,
            token,
        })
    } else {
        res.status(statusCode).json({
            status: "fail",
            statusCode,
            message: "Something went wrong,please try again"
        })
    }
}

/*
 * req:request for signUp(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.signUp = catchAsync(async (req, res, next) => {
    let message = "You are successfully registered"
    const pass = req.body.password;
    const cpass = req.body.passwordConfirm;
    const exp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    const spaceCheckPassword = pass.match(exp)
    const spaceCheckConfirmPassword = cpass.match(exp)
    req.body.password = JSON.parse((JSON.stringify(spaceCheckPassword.input)).replaceAll(" ", ''))
    req.body.passwordConfirm = JSON.parse((JSON.stringify(spaceCheckConfirmPassword.input)).replaceAll(" ", ''))

    const newUser = await User.create(req.body);

    const url = `${req.protocol}://${req.get('host')}/signUp`;
    console.log(url);

    await new Email(newUser, url).sendWelcome();
    createSendToken(newUser, 201, res, message);
    // const token=signToken(use)
});

/*
 * req:request for login(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.signIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    let message = "You are successfully login"

    //1)Check if email and password exists 
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400))
    }

    //2)Check if user exists && password is correct
    const user = await User.findOne({ email }).select("password");

    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError("Incorrect email or password,please try again", 401))
    }

    //3)if everything is ok,send token to client
    createSendToken(user, 200, res, message);
});

/*
 * req:request for authorization(user is valid or not)
 * res:get back response from api request
 * next:is middleware
 */
exports.protect = catchAsync(async (req, res, next) => {
    //1)Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in,please login to get access.', 401))
    }

    //2)Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log('decoded', decoded)

    //3)Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(new AppError('User recently changed password,please login again.', 401))
    }

    if ((decoded.exp * 1000) < Date.now()) {
        res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: "Token expired,please login to get access"
        })
    } else {
        req.user = freshUser;
        next();
    }
})

/*
 * req:request for logout
 * res:get back response from api request
 * next:is middleware
 */
exports.logout = (req, res, next) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '1s'
    })
    console.log(token);
    return res.status(200).json({
        statusCode: 200,
        status: 'success',
        message: "Logout successfully",
        token
    })
}