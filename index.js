const express = require("express");
const app = express();
const PORT = 8000;
const path = require("path");
const { connectMongodb } = require("./connect.js");
const cookieParser = require("cookie-parser");
const URL = require("./models/url.js");
const { checkForAuthentication, restrictTo } = require("./middleware/auth.js");
const urlRoute = require("./routes/url.js");
const staticRoute = require("./routes/staticRouter.js");
const userRoute = require("./routes/user.js");

connectMongodb("mongodb://localhost:27017/shortUrl").then(() =>
  console.log("mongodb connected")
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Fixed this line

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(checkForAuthentication);
// Log middleware
app.use("/url", restrictTo(["normal", "admin"]), urlRoute);

app.use("/user", userRoute);
app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );
  if (!entry) {
    return res.status(404).send("URL not found");
  }
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
