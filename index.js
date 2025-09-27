import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000;


// Create Post Variable Array
const createPost = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req,res) =>{
    res.render("index");
})

app.get("/sign-up",(req,res) =>{
    res.render("sign-up");
});

/*
// app.get("/home", (req,res) =>{
//     res.render("index",{posts: createPost});
// })

app.post("/posts",(req,res) =>{
    // Accessing my Post form details
    const postForm = req.body;
    console.log("recieved form data", postForm);

    // Sent my post form details to my create post array
    createPost.push(postForm);
    console.log("This is my updated creatPost array",createPost);
    res.redirect("/home");
    
  
});
*/

app.listen(port, () => {
    console.log(`Server starts at http:localhost:${port}`);
})