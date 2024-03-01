const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/UserRoutes");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://SaviYa:SaviYa1000!!@cluster0.rdqilok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
{
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(()=>{
    console.log("DB Connected");
});



app.use("/api/user", userRoutes);

app.listen(5000, console.log("server started on port 5000"));