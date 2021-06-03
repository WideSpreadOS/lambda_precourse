const mongoose = require('mongoose'); 
  
const notebookSectionSchema = new mongoose.Schema({ 
    sectionFrom: {type: mongoose.Schema.Types.ObjectId, ref: 'Notebook'},
    
    sectionName: String,
    sectionDescription: String,
    sectionTags: [String],
    sectionColor: String,
    sectionImage: String,
    notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
    sectionCreated: {type: Date, default: Date.now()}
});
  
module.exports = new mongoose.model('NotebookSection', notebookSectionSchema); 