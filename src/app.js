let express = require('express');
let app = express();
let mongoose = require('mongoose');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/guiapics')
.then(() => {})
.catch((err) => {
    console.log(err);
})

app.get('/', (req, res) => {
    res.json({});
});

module.exports = app;