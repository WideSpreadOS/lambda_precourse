const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const axios = require('axios');
const methodOverride = require('method-override');

const User = require('../models/User');
const CodeBlock = require('../models/CodeBlock');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
    res.render('code-editor',{/* user: , */title:"Code Editor"});
});

// Code Bin - All Code Blocks
router.get('/all', async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    console.log(`User: ${user}`)
    res.render('code-bin-all', {user});
});

router.post('/save', ensureAuthenticated, async (req, res) => {
    const user = req.user._id;
    const codeToSave = req.body;
    const newCode = await new CodeBlock({
        codeBlockFrom: user,
        codeBlockTitle: req.body.codeBlockTitle,
        codeBlocks: {
            html: req.body.html,
            css: req.body.css,
            js: req.body.js
        }
    });
    newCode.save();
    res.redirect(req.get('referer'));
});


// Code Editor/User Settings & Prefrences
router.get('/settings', ensureAuthenticated, async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    console.log(`User: ${user}`)
    res.render('user-settings', {user});
});

/* 
router.post('/settings', ensureAuthenticated, async (req, res, next) => {
    const userId = req.user._id;
    try {
        const id = req.user._id;
        const updates = req.body;
        const options = {new: true};
        await User.findByIdAndUpdate(id, updates, options);
    
        res.redirect(`/users/settings`);
    } catch (error) {
        console.log(error);
    } 
});
 */

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    console.log(`User: ${user}`)
    res.render('user-profile', {user});
});

module.exports = router;