let express = require("express");
let app = express();
let mongoose = require("mongoose");
let userModel = require("./models/User");
let bcrypt = require("bcrypt");


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/guiapics")
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });

let User = mongoose.model("User", userModel);

app.get("/", (req, res) => {
  res.json({});
});

app.post("/user", async (req, res) => {
  let password = req.body.password;
  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(password, salt);
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash,
  });

  if ((!req.body.name, !req.body.email, !req.body.password)) {
    res.sendStatus(400);
    return;
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        res.statusCode = 400;
        res.json({ error: 'Email já cadastrado' });
        return;
    }
    
    await newUser.save();
    res.json({ email: req.body.email });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.delete('/user/:email', async (req, res) => {
  await User.deleteOne({'email': req.params.email});
  res.sendStatus(200);
})

module.exports = app;
