const express = require("express");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const { connectToDb, getToDb } = require("./db");

const app = express();

app.use(express.json());

let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app is listeing to port 3000");
    });
  }

  db = getToDb();
});

app.get("/users", (req, res) => {
  let users = [];

  db.collection("users")
    .find()
    .sort({ name: 1 })
    .forEach((user) => users.push(user))
    .then(() => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

app.post("/users/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    password = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password,
    };

    db.collection("users")
      .insertOne(newUser)
      .then(() => {
        res.status(200).json({
          Message: "User created successfully",
          ...newUser,
        });
      })
      .catch((err) => {
        res.status(500).json({ Error: " Error occured" });
      });
  } catch {
    console.log("Failed");
  }
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  let user = [];

  db.collection("users")
    .findOne({ email: email })
    .then(async (data) => {
      user.push(data);
      const checkpass = await bcrypt.compare(password, user[0].password);
      try {
        if (checkpass) {
          console.log(bcrypt.compare(password, user[0].password));
          res.status(200).json({
            Message: "Login succesfull",
            ...user,
          });
        } else {
          res.status(500).json({ Message: "Wrong password, Try again" });
        }
      } catch {
        res.status(500).send();
      }
    })
    .catch((err) => {
      res.status(500).json({ Error: "Error Occured" });
      console.log(err);
    });
});

// let imageFilesPath = []

// Joining path of directory
// const directotyPath = path.join(__dirname, 'images')
// Passing directoryPath and callback function
// fs.readdir(directotyPath, function (err, files) {
//   let imageFiles = []
// Handling error
// if (err) {
//   return console.log('Unable to scan directory: ' + err)
// }
// Listing all files using forEach
// files.forEach(function (file) {
// Do whatever you want to do with the file
//     imageFiles.push(file)

//     imageFilesPath = imageFiles.map(imageFile => {
//       return process.cwd() + '/images' + imageFile
//     })

//     console.log(imageFilesPath)
//   })
// })

app.get("/products", (req, res) => {
  let products = [];

  db.collection("products")
    .find()
    .sort({ name: 1 })
    .forEach((product) => products.push(product))
    .then(() => {
      res.status(200).json(products);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error occured",
      });
    });
});
