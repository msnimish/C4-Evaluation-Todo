require("dotenv").config();

let express = require("express");
let app = express();
let cors = require("cors");
let bcrypt = require("bcrypt");
let { connection } = require("./config/db");
const { UserModel } = require("./models/user.model");
let jwt = require("jsonwebtoken");
let dns = require("dns");
const { authenticate } = require("./middleware/authenticate");
const { TodoRouter } = require("./routes/todos.routes")

app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  try {
    let { email, password } = req.body;
    let IPAddress;
    dns.lookup(process.env.HOSTNAME, (err, address) => {
      if (err) console.log(err);
      IPAddress = address;
    });
    // console.log(IPAddress);
    bcrypt.hash(password, 8, async function (err, hash) {
      if (err) {
        console.log(err);
        res.send({ msg: "Something went wrong with hashing" });
      }
      let payload = {
        email: email,
        password: hash,
        // userIP: IPAddress
      };
      let user = new UserModel(payload);
      await user.save();
      res.send({ msg: "Signup Successful!" });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    console.log(user);
    if (user) {
      await bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          console.log(err);
          res.send({ msg: "Something went wrong with hashing" });
        }
        if (result) {
            let token = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY)
          res.send({ msg: "Login Successful!", token });
        }else{
            res.send({ msg: "Wrong credentials" });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: "Something went wrong" });
  }
});

app.use(authenticate)
app.use("/todos", TodoRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to database");
    console.log("Listening on port " + process.env.PORT);
  } catch (err) {
    console.log("Connection to DB failed");
  }
});
