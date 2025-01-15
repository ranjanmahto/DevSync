const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    htmlCode: {
        type: String,
        // required: true
    },
    cssCode: {
        type: String,
        // required: true
    },
    jsCode: {
        type: String,
        // required: true
    }
}, { timestamps: true });

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;