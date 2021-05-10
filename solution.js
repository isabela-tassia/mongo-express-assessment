const express = require("express"); //
const bodyParser = require("body-parser"); //
//
const app = express(); //
mongoose.connect(MONGODB_URL); //
//
app.use(bodyParser.json()); //
app.listen(3000); //
/****************************************************/
/* Environment setup. Do not modify the above code. */
// MODELS
// `Album` model:
const Album = mongoose.model(
  "Album",
  new mongoose.Schema({
    performer: String,
    title: String,
    cost: Number
  })
);
// `User` model:
const User = mongoose.model("User", new mongoose.Schema({ name: String }));
// `Purchase` model:
const Purchase = mongoose.model(
  "Purchase",
  new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" }
  })
);
// ROUTES
// POST /albums
app.post("/albums", (req, res) => {
  Album.create(req.body)
    .then((album) => res.json({ data: album }))
    .catch((error) => console.log(error));
});
// GET /albums
app.get("/albums", (req, res) => {
  Album.find()
    .then((albums) => res.json({ data: albums }))
    .catch((error) => console.log(error));
});
// GET /albums/:albumId
app.get("/albums/:albumId", (req, res) => {
  Album.findOne({ _id: req.params.albumId })
    .then((album) => res.json({ data: album }))
    .catch((error) => console.log(error));
});
// POST /albums/:albumId
app.post("/albums/:albumId", (req, res) => {
  Album.findOneAndUpdate({ _id: req.params.albumId }, req.body, { new: true })
    .then((album) => res.json({ data: album }))
    .catch((error) => console.log(error));
});
// POST /albums/:albumId/delete
app.post("/albums/:albumId/delete", (req, res) => {
  Album.findOneAndRemove({ _id: req.params.albumId })
    .then(() => res.sendStatus(204))
    .catch((error) => console.log(error));
});
// POST /purchases - you will use .populate() here
app.post("/purchases", (req, res) => {
  Purchase.create({ user: req.body.user._id, album: req.body.album._id })
    .then((purchase) => {
      Purchase.findById(purchase._id)
        .populate("album")
        .populate("user")
        .then((purchase) => res.json({ data: purchase }));
    })
    .catch((error) => console.log(error));
});