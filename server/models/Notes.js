const mongoose = require('mongoose');
const User = require('./User');


const Schema = mongoose.Schema;
const NotesSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        reuqired: true
    },
    body: {
        type: String,
        reuqired: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Note', NotesSchema)