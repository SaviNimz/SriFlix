const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes");
const app = express();
app.use(cors());
app.use(express.json());

// acquiring the environment variable associated with the mongoDB credentials 

require('dotenv').config();
const mongoose = require("mongoose");

// connecting to the database

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB Connected");
}).catch((err) => {
    console.error("DB Connection Error: ", err);
});


app.use("/api/user", userRoutes);

app.listen(5000, console.log("server started on port 5000"));

