const mongoose = require('mongoose')


const Schema = mongoose.Schema;
const UserSchema = new Schema({
    googleId: {
        type: String,
        reuqired: true
    },
    displayName: {
        type: String,
        reuqired: true
    },
    firstName: {
        type: String,
        reuqired: true
    },
    lastName: {
        type: String,
        reuqired: true
    },
    profileImage: {
        type: String,
        reuqired: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('User', UserSchema)