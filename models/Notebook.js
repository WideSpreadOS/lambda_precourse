const mongoose = require('mongoose'); 
  
const notebookSchema = new mongoose.Schema({ 
    notebookOwner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    
    notebookName: {
        type: String,
        unique: true
    },
    notebookDescription: String,
    notebookTags: [String],
    notebookColor: String,
    notebookImage: String,
    notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
    notebookCreated: {type: Date, default: Date.now()}
}); 
  
//Notebook is a model which has a schema imageSchema 
  
module.exports = new mongoose.model('Notebook', notebookSchema); 