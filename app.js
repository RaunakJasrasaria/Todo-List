const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

var items = ["first","second"];
var workItems = [];

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
