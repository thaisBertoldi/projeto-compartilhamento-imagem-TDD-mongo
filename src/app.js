let express = require('express');
let app = express();
let mongoose = require('mongoose');
let userModel = require('./models/User');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/guiapics')
.then(() => {})
.catch((err) => {
    console.log(err);
})

let User = mongoose.model('User', userModel);

app.get('/', (req, res) => {
    res.json({});
});

app.post('/user', async (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    if (!req.body.name, !req.body.email, !req.body.password) {
        res.sendStatus(400);
        return;
    }

    try {
        await newUser.save();
        res.json({ email: req.body.email });
    } catch (error) {
        res.sendStatus(500);
    }
})

module.exports = app;