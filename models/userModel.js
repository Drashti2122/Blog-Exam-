const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name must be required"],
    },
    email: {
        type: String,
        required: [true, 'Email must be required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Please provide valid email(abc@gmail.com)"]
    },
    cno: {
        type: String,
        unique: true,
        required: [true, 'Contact name must be required'],
        trim: true,
        validate: {
            validator: function (el) {
                const exp = /^(0|91)?[6-9][0-9]{9}$/;
                return el.match(exp)
            },
            message: "Invalid Contact Number"
        }
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password must be required"],
        validate: {
            validator: function (e) {
                const exp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
                const pwd = e.match(exp)
                const ans = JSON.parse((JSON.stringify(pwd.input)).replaceAll(" ", ''))
                return ans
            },
            message: "Minimum eight characters, at least one letter, one number and one special character and not allow space between character"
        }
        // Minimum eight characters, at least one letter, one number and one special character
    },
    passwordConfirm: {
        type: String,
        trim: true,
        required: [true, 'Confirm password must be required'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password and confirmPassword must be same!'
        }
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    //only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model("user", userSchema);