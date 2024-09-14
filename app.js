const express = require("express");
const { connectToMongoDB } = require("./connect");
const path = require('path');
const URL = require('./models/url');
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const app = express();
const PORT = 5000;

connectToMongoDB('mongodb+srv://amaresoham:HYpACYyJBmfQwHJk@cluster0.nhomn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Mongodb connected'));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/url", urlRoute);

app.use("/", staticRoute);

app.get('/url/:shortId', async(req, res) => {
    const shortId = req.params.shortId;
    // console.log(shortId);
    const entry = await URL.findOneAndUpdate({
        shortId, 
    }, { $push: {
        visitHistory: {
            timestamp : Date.now(),
        },
    },
});
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));