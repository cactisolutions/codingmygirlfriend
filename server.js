// Imports
const app = express()
app.use(parser.json() );
app.use(parser.urlencoded({ extended: true }));
const port = 3000
var Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;
const readline = require('readline');
const mongoose = require("mongoose");
const fs = require("fs") // read file
const parser = require("body-parser");
const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/pa10';
const hostname = 0;
const express = require("express")


// This sets up the schema which is the logic og the mongoose
var ItemsSchema = new Schema({
    title: String,
    description: String,
    status: String,
    image: String,
    price: Number,
});
var UserSchema = new Schema({
    listings:[{ type : ObjectId, ref: 'Items' }],
    purchases:[{ type : ObjectId, ref: 'Items' }],
    username: String,
    password: String,
}) 
var User = mongoose.model("User",UserSchema);
var Item = mongoose.model('Items', ItemsSchema );


// This initilizes the connection to mongoose
mongoose.connect(mongoDBURL,{useNewUrlParser:true});
db.on('error',console.error.bind(console,"MongoDB connection error"));

app.use(express.static("public_html")) 


// Gets descreption of items
app.get('/get/users/',(req,res)=>{
    User.find({
    }).exec(function(error,results){
        res.send(JSON.stringify(results, null, 10));
    })
    
});

// This gets every item
app.get('/get/items/',(req,res)=>{
    Item.find({
    }).exec(function(error,results){
        res.send(JSON.stringify(results, null, 10));
    })
});

// Gets list of item of username
app.get('/get/listings/:USERNAME',async (req,res)=>{
    const USERNAME = req.params.USERNAME;
    await User.findOne({username:`${USERNAME}`}, async function(err,obj) {
        const resLst = [];

        if (obj!==null){ 
            const itemIds = obj["listings"];
            for (var i in itemIds){
                const id = itemIds[i];
                await Item.findOne({_id:id},function(err,obj) 
                {
                    resLst.push(obj)

                });
            }

            res.send(JSON.stringify(resLst, null, 10))
            return;
        }
        res.send(JSON.stringify(resLst, null, 10))
        return;
        
      
     });
    
});

// This gets list of every item purchased
app.get('/get/purchases/:USERNAME',async (req,res)=>{
    const USERNAME = req.params.USERNAME;
    await User.findOne({username:`${USERNAME}`}, async function(err,obj) {
        const resLst = [];

        if (obj!==null){
            const itemIds = obj["purchases"];
            for (var i in itemIds){
                const id = itemIds[i];
                await Item.findOne({_id:id},function(err,obj) 
                {
                    resLst.push(obj)

                });
            }
            res.send(JSON.stringify(resLst, null, 10))
            return;
        }
        res.send(JSON.stringify(resLst, null, 10))
        return;
      
     });

});

// This returns the users username
app.get('/search/users/:KEYWORD',(req,res)=>{
    const KEYWORD = req.params.KEYWORD;
    User.aggregate(
        [
            { "$match": {
                "username": { "$regex": `${KEYWORD}`, "$options": 'i' }
            }},
    
        ],
        function(err,results) {
            if (results!==null){
                res.send(JSON.stringify(results, null, 10))
                return;
            }
            res.send(JSON.stringify([], null, 10))
            return;
        }
    )
});

// This gets and returns the list of items and 
// descriptions
app.get('/search/items/:KEYWORD',(req,res)=>{
    const regexStr = req.params.KEYWORD;
    Item.aggregate(
        [
            { "$match": {
                "description": { "$regex": `${regexStr}`, "$options": 'i' }
            }},
    
        ],
        function(err,results) {
            if (results!==null){
                res.send(JSON.stringify(results, null, 10))
                return;
            }
            res.send(JSON.stringify([], null, 10))
            return;
        }
    )
});

// This additions to the databased the user's login info
// such as the username and password
app.post('/add/user/', (req, res) => {
    const newInputty =  JSON.parse(req.body.person);
    var data =  new User({
        listings: newInputty.listings, 
        password: newInputty.password,
        purchases: newInputty.purchases,
        username: newInputty.username,
    })
    data.save(function (err){
        if (err){
            console.log("Not Working")
        } 
    })
});

// This portion then additions to the data based including the important
// information catgories and listing the username
app.post('/add/item/USERNAME', (req, res) => {
    const newInputty =  JSON.parse(req.body.product);
    var data =  new Item({
        description: newInputty.description,
        price: newInputty.price,
        title: newInputty.title, 
        image: newInputty.image,
        status: newInputty.status,
    })
    data.save(function (err){
        if (err){
        } 
    })
    User.update(
        {username:`${newInputty.username}`},
        {$push:{
            listings:`${data._id}`
        }}
    ).exec();
        
   
});

//This adds the url used when listenng to the port
app.listen(port,()=>
console.log(`http://${hostname}:${port}`)
)