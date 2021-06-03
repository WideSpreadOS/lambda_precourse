const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const axios = require('axios');
const methodOverride = require('method-override');

const User = require('../models/User');
const Notebook = require('../models/Notebook');
const NotebookSection = require('../models/NotebookSection');
const Note = require('../models/Note');


const { ensureAuthenticated } = require('../config/auth');

// Your Desk Main Page
router.get('/main', ensureAuthenticated, async (req, res) => {
    const userId = req.params.userId;
    const userAuthId = req.user._id;
    const user = await User.findById(userAuthId);
    res.render('student-desk-main', {title: 'Your Desk Main', user});
});
// Notes Main Page
router.get('/notebooks', ensureAuthenticated, async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const notebooks = await Notebook.find({notebookOwner: {$eq: userId}}).populate('sections').exec()
    console.log(`Notebooks Data: \n ${notebooks}`)
    const notes = await Note.find({})
    
    res.render('notebooks', {user, notebooks, title: 'Notebooks'});
});

router.post('/new-notebook', (req, res) => {
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


// Notebook Page
router.get('/notebooks/:notebookId', ensureAuthenticated, async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const notebookId = req.params.notebookId;
    const notebookTitle = await Notebook.findById(notebookId).select('notebookName')
    const notebook = await Notebook.findById(notebookId).populate('sections').exec()
    const sections = await NotebookSection.find({'sectionFrom': {$eq: notebookId}});
    const notes = await Note.find({noteFrom: {$eq: notebookId}});
    
    res.render('notebook-single', {user, notebook, sections, notes, title: notebookTitle});
});

// POST - New Section
router.post('/notebooks/:notebookId/section/new', async (req, res) => {
    const notebookId = req.params.notebookId;
    const section = new NotebookSection({
        sectionFrom: notebookId,
        sectionName: req.body.sectionName,
        sectionDescription: req.body.sectionDescription,
        sectionColor: req.body.sectionColor
    });
    section.save();
    await Notebook.findByIdAndUpdate(notebookId,
        {$addToSet: {sections: section._id}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
                console.log(err);
            } else {
                return
            }
        }
    )
    res.redirect(req.get('referer'));
});

router.get('/notes/:notebookId/section', ensureAuthenticated, async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const notebookId = req.params.notebookId;
    const notebook = await Notebook.findById(notebookId);
    const notebookTitle = await Notebook.findById(notebookId).select('notebookName');
    res.render('notebook-sections', {title: notebookTitle, user, notebook})
});


router.post('/notes/:notebookId/:sectionId/note/new', async (req, res) => {
    const userId = req.user._id;
    const notebookId = req.params.notebookId;
    const sectionId = req.params.sectionId;
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
});

module.exports = router;