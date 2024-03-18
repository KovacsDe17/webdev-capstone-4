import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const jokeCount = 318; //Maximum number of jokes available. May change later, see the docs of JokeAPI.

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.render("index.ejs");
});

app.post("/show-joke", async (req, res)=>{
    let nameOfUser = req.body.name;
    let id = calculateID(nameOfUser);

    try {
        const result = await axios.get(`https://v2.jokeapi.dev/joke/Any?idRange=${id}`);
        console.log(result.data);
        res.render("index.ejs",{
            name: nameOfUser,
            joke: result.data
        });
    } catch (error) {
        res.status(404).send("Error: " + error.message);
    }


});

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
});

function calculateID(name){
    let sum = 0;
    let exponent = name.length-1;

    for (let i = 0; i < name.length; i++) {
        let charValue = name.charCodeAt(i);
        
        sum += (charValue * (10**exponent));
        
        exponent--;
    }

    return sum % jokeCount; //Return an ID between 0 and the max number of jokes, based on the given name.
}