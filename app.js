//requiring modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//setting up app, body-parser, ejs and static files
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

//connecting to database
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/todolistDB");

//item schema for default todolist
const itemsSchema = new mongoose.Schema({
  name: String
});

//Item collection made
const Item = mongoose.model("Item",itemsSchema);

//Default items for various lists
const item1 = new Item({
  name:"Welcome to your todoList"
});
const item2 = new Item({
  name:"Hit the + button to add a new item"
});
const item3 = new Item({
  name:"<-- Hit this to delete an item"
});
const defaultItems = [item1,item2,item3];

//creating a new custom schema for the custom list
const customSchema = new mongoose.Schema({
  name:String,
  items:[itemsSchema]
});
const CustomList = mongoose.model("CustomList",customSchema);

//variable day made which stores the current day for the default list
const today = new Date();
const options = { weekday: 'long' };
const day = today.toLocaleDateString("en-IN",options);

//get request for the home route
app.get("/", function(req, res) {

  //reading through the Item collection
  Item.find(function(err,foundItems){
    //if the list is empty then adding the default items
    if(foundItems.length === 0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Successfully added default items to DB");
        }
      });
    }

    if(err){
      console.log(err);
    }else{
      res.render('list', {
        title: day,
        newItems: foundItems
      });
    }
  });

});

//get request for the custom listS
app.get("/:customList",function(req,res){
  const customListName = req.params.customList;

  CustomList.findOne({name:customListName},function(err,foundList){
    if(err){
      console.log(err);
    }else{
      if(!foundList){
        const list = new CustomList({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      }else{
        res.render("list",{
          title:foundList.name,
          newItems:foundList.items
        });
      }
    }
  });
});



//post request for the home route
app.post("/",function(req,res){
  var item = req.body.val;        //stores the new entry by the user in the list
  var list = req.body.button;     //stores the name of the list in which new item is added
  const newitem = new Item({         //stores new entry in the required format
    name:item
  });

  if(list === day){                //if the list title is the current day(default)then save in the default collection(Item)
    newitem.save();
    res.redirect("/");

  }else{
    CustomList.findOne({name:list},function(err,foundList){

        foundList.items.push(newitem);
        foundList.save();
        res.redirect("/"+list);

    });
  }
});

//post request for the home route
app.post("/delete",function(req,res){
  const checkbox = req.body.checkbox;  //stores the id of the element which user selects throught the checkbox

  //deleting the selected item
  Item.deleteOne({_id:checkbox},function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successfully deleted the selected item");
      res.redirect("/");
    }
  });
});

//listening to the indicated port
app.listen(3000, function() {
  console.log("Server started at port 3000 ");
})
