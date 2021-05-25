const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const axios = require('axios');
const methodOverride = require('method-override');

const User = require('../models/User');
const Notebook = require('../models/Notebook');
const Note = require('../models/Note');


const { ensureAuthenticated } = require('../config/auth');

// Your Desk Main Page
router.get('/:userId/main', ensureAuthenticated, async (req, res) => {
    const userId = req.params.userId;
    const userAuthId = req.user._id;
    const user = await User.findById(userAuthId);
    res.render('student-desk-main', {title: 'Your Desk Main', user});
});
// Notes Main Page
router.get('/:userId/notebooks', ensureAuthenticated, async (req, res) => {
    const userId = req.params.userId;
    const user = req.user._id;
    const notebooks = await Notebook.find({notebookOwner: {$eq: user}}).populate('notes').exec()
    const notes = await Note.find({})
    
    res.render('notebooks', {user, notebooks, title: 'Notebooks'});
});

router.post('/:userId/new-notebook', (req, res) => {
    const notebook = new Notebook({
        userId: req.user._id,
        notebookOwner: req.user.id,
        notebookName: req.body.notebookName,
        notebookDescription: req.body.notebookDescription,
        notebookColor: req.body.notebookColor
    })
    notebook.save()
    /* res.redirect(`/your-desk/${userId}/notebooks`); */
    res.redirect(req.get('referer'));
});


router.post('/:userId/note/new/:notebookId', async (req, res) => {
    const userId = req.params.userId;
    const notebookId = req.params.notebookId;
    const note = new Note({
        noteFrom: notebookId,
        noteTitle: req.body.noteTitle,
        noteCategory: req.body.noteCategory,
        noteColor: req.body.noteColor,
        noteBody: req.body.noteBody
    })
    note.save()
    await Notebook.findByIdAndUpdate(notebookId,
        {$addToSet: {notes: note._id}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
                console.log(err);
            }else{
                
                return
            }
        }
        )
        res.redirect(req.get('referer'));
})
module.exports = router;