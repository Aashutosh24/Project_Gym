// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');

// const app = express();
// const port = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose.connect('mongodb://127.0.0.1:27017/gymUsers', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.error(err));

// // Schema and Model
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   picture: String,
//   date: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);

// // API to save user
// app.post('/api/save-user', async (req, res) => {
//   const { name, email, picture } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });

//     if (!existingUser) {
//       await User.create({ name, email, picture });
//       console.log("New user saved:", email);
//     } else {
//       console.log("User already exists:", email);
//     }

//     res.status(200).json({ message: "User processed" });
//   } catch (error) {
//     console.error("Error saving user:", error);
//     res.status(500).json({ message: "Error saving user" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });



// Copilot
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (no deprecated options)
mongoose.connect('mongodb://127.0.0.1:27017/gymUsers')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  picture: String,
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// API to save user
app.post('/api/save-user', async (req, res) => {
  const { name, email, picture } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, picture });
      console.log("New user saved:", email);
    } else {
      console.log("User already exists:", email);
    }
    res.status(200).json({ message: "User processed" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Error saving user" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});