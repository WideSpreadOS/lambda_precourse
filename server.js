const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const User = require('./models/User');

const PORT = process.env.PORT || 3000;
require('./config/passport')(passport);
// DB Config
const db = require('./config/keys').MongoURI;
const { ensureAuthenticated } = require('./config/auth');

// Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const app = express();

// Middleware
app.use(bodyParser.urlencoded({extended: false}));



// Static
app.use(express.static('public'));
// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Method Override
// Connect Flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
app.use('/users', require('./routes/users'));
app.use('/code', require('./routes/code'));
app.use('/your-desk', require('./routes/your-desk'));

app.get('/', (req, res) => { 
    res.render('welcome',{title:"Welcome"});
});

app.get('/dashboard', ensureAuthenticated, async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const allUsers = await User.find();
    console.log(`User logged in: ${user}`);
    res.render('dashboard', {user, allUsers, title:"Dashboard"});
});


app.get('/desk', ensureAuthenticated, async (req, res) => { 
    const userId = req.user._id;
    const user = await User.findById(userId)
    res.render('student-desk',{user, title:"Your Desk"});
});

app.get('/classroom', ensureAuthenticated, (req, res) => { 
    res.render('class-student',{/* user: , */title:"Classroom"});
});

app.get('/project-manager', ensureAuthenticated, (req, res) => { 
    res.render('project-manager',{/* user: , */title:"Project Manager"});
});


app.get('/resources', ensureAuthenticated, (req, res) => { 
    res.render('resources',{/* user: , */title:"Resources"});
});

app.get('/flashcards', ensureAuthenticated, (req, res) => { 
    res.render('flashcards',{/* user: , */title:"Flashcards"});
});

app.get('/typing', ensureAuthenticated, (req, res) => { 
    res.render('typing',{/* user: , */title:"Typing"});
});

app.get('/social', ensureAuthenticated, (req, res) => { 
    res.render('socialize',{/* user: , */title:"Socialize"});
});


app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
})