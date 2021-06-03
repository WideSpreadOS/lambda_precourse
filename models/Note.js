const mongoose = require('mongoose'); 
  
const noteSchema = new mongoose.Schema({ 
    noteFrom: {type: mongoose.Schema.Types.ObjectId, ref: 'NotebookSection'},
    noteTitle: String,
    noteCategory: String,
    noteTags: [String],
    noteColor: String,
    noteImages: [String],
    noteBody: String,
    noteReferences: [String],
    /* flashcards: [{type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard'}], */
    noteCreated: {type: Date, default: Date.now()}
}); 
  
  
module.exports = new mongoose.model('Note', noteSchema); 