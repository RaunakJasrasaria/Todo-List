const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name:"Welcome to your todoList"
});
const item2 = new Item({
  name:"Hit the + button to add a new item"
});
const item3 = new Item({
  name:"<-- Hit this to delete an item"
});

Item.insertMany([item1, item2, item3],function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Successfully added default items to DB");
  }
})


app.get("/", function(req, res) {

  var today = new Date();

  var options = { weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                 };
  var day = today.toLocaleDateString("en-IN",options);
  res.render('list', {
    title: day,
    newItems: items
  });
});

app.get("/work",function(req,res){
  var work = "Work";
  res.render('list',{
    title: work,
    newItems: workItems
  });
});

app.post("/",function(req,res){
  var item = req.body.val;
  if(req.body.button === "Work"){
    workItems.push(item);
    res.redirect("/work");
  }else{
    items.push(item);
    res.redirect("/");
  }
});

app.listen(3000, function() {
  console.log("Server started at port 3000 ");
})
