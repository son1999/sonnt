const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

// import router
const authRoute = require('./routers/auth');

// Set up default port
const port = process.env.PORT || 5000;

// Set up default mongoose connection
const mongoDBUri = process.env.MONGODB_URL;
mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("DB connect successfull!");
        })
        .catch((err) => {
            console.log(err);
        });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(cors());
app.use(express.json());

// Router
app.use('/api/auth', authRoute);

app.listen(port, () => {
    console.log("Backend server is running on port " + port);
});
