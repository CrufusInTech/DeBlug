import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req,res) => {
    res.render("index");
})

app.listen(port, () => {
    console.log(`Server starts at http:localhost:${port}`);
})