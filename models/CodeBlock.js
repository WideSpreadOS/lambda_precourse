const mongoose = require('mongoose'); 
  
const codeBlockSchema = new mongoose.Schema({ 
    codeBlockFrom: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    codeBlockTitle: {
        type: String
    },
    codeBlockCategory: String,
    codeBlockTags: [String],
    codeBlockBody: String,
    codeBlocks: {
        html: String,
        css: String,
        js: String
    },
    codeBlockReferences: [String],
    codeBlockCreated: {type: Date, default: Date.now()}
}); 
  
  
module.exports = new mongoose.model('CodeBlock', codeBlockSchema); 