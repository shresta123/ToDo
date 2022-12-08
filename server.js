const express = require('express');
const app = express();
const port = 3000;
const request = require('request');

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");

initializeApp({
    credential: cert(serviceAccount),
}); 

const db = getFirestore();
 
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render('start.ejs');
 });

app.get("/signup", (req, res) => {
    res.render('signup');
 });
 
app.get('/signupsubmit', (req, res) => {
    
    const Username = req.query.user_name;
    const email = req.query.email;
    const password = req.query.psw;
    const rep_psw = req.query.psw_repeat;

    
    //Adding data to the collection
    if(password == rep_psw){
        db.collection('users')
        .add({
            username: Username,
            email:email,
            password: password,
        })
        .then(() => {
            res.render("signin");
        });
    }else{
        res.send("SignUP Failed");
    }
});

app.get("/signin", (req, res) => {
    res.render('signin');
 }); 

 app.get('/signinsubmit', (req, res) => {
    const email = req.query.emil;
    const password = req.query.passwrd;

    db.collection("users")
        .where("email", "==", email)
        .where("password", "==", password)
        .get()
        .then((docs) => {
            if(docs.size>0){
                res.render("index");
            }else{
                res.send("Login Failed");
            }
        });
 });
app.listen(port, () => {
    console.log(`Your APP is running in the port ${port}`);
})