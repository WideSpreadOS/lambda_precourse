const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const axios = require('axios');
const methodOverride = require('method-override');

const User = require('../models/User');
const { ensureAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', (req, res) => {
    const currentUser = null
    res.render('login', {title: 'Login', currentUser});
})
// Register Page
router.get('/register', (req, res) => {
    const currentUser = null
    res.render('register', {title: 'Register', currentUser});
})

// Register Handle
router.post('/register', (req, res) => {
    const {fname, lname, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if(!fname || !lname || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields'})
    }
    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match'})
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters'})
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            fname,
            lname,
            email,
            password,
            password2
        });
    } else {
        // Validation Pass
        User.findOne({ email: email })
        .then(user => {
            if (user) {
                // User Exists
                errors.push({ msg: 'Email is already registered'})
                res.render('register', {
                    errors,
                    fname,
                    lname,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    fname,
                    lname,
                    email,
                    password
                });
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    // Set password to hashed
                    newUser.password = hash;
                    // Save user
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.render('login', {title: 'Login'});
                        })
                        .catch(err => console.log(err));

                }))
            }
        })
        .catch();
    }
})


// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')
});

// Generate Face User Avatar
router.get('/ai-user', async (req, res) => {
    const apiKey = process.env.AI_AVATARS;
	const options = {
  method: 'GET',
  url: `https://api.generated.photos/api/v1/faces?api_key=${apiKey}&age=young-adult&per_page=1`
};

await axios.request(options).then(function (response) {
    const returnedData = response.data.faces[0].urls;
    /* const aiUser = JSON.stringify(returnedData[4]); */
    const aiUser = returnedData[4];
    const aiAvatarString = JSON.stringify(Object.values(aiUser));
    const aiAvatarStringLength = (aiAvatarString.length - 4);

    const aiAvatar = aiAvatarString.substr(2, aiAvatarStringLength)

    res.render('ai-user', {aiAvatar});
}).catch(function (error) {
	console.error(error);
});
});

router.get('/:userId/settings', async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    console.log(`User: ${user}`)
    res.render('user-settings', {user});

});

router.post('/:userId/settings', ensureAuthenticated, async (req, res, next) => {
    const userId = req.user._id;
    try {
        const id = req.user._id;
        const updates = req.body;
        const options = {new: true};
        await User.findByIdAndUpdate(id, updates, options);
    
        res.redirect(`/users/${userId}/settings`);
    
    
    } catch (error) {
        console.log(error);
    }
    
})

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    console.log(`User: ${user}`)
    res.render('user-profile', {user});

});

module.exports = router;