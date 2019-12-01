//jshint esversion:6
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopdb', {useNewUrlParser: true, useUnifiedTopology: true});
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
var productsArray = [];
var port = 3020;


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


/*  MONGO DB CODE  */

const productSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  price: Number,
  stock: Number,
  reviews: [{
    _id: false,
    personName: String,
    personId: Number,
    personAddress: String,
    comment: String
  }]

  },
  {versionKey: false}
);

const Product = mongoose.model("Product", productSchema);


/******************/
/*  NODE.JS CODE  */
/******************/

app.get("/", function(req, res) {
  var h1 = "Home";
  res.render("home",{header1:h1});
});


app.get("/listProducts", function(req, res) {
  var h1 = "Current Products";
  productsArray = [];
  Product.find(function(err, products) {
    if (err) {
      console.log(err);
    } else {
      products.forEach(function(product) {
        productsArray.push(product);
      });
    }

    res.render("listProducts",{header1:h1,curProducts:productsArray});
  });

});

app.post("/listProducts", function(req, res) {
  res.redirect("/listProducts");
});



app.get("/newProduct", function(req, res) {
  var h1 = "Add New Product";
  res.render("newProduct",{header1:h1});
});

app.post("/newProduct", function(req, res) {
  id = req.body.productId;
  name = req.body.productName;
  price = req.body.productPrice;
  stock = req.body.productStock;
  //console.log("ID: "+id+"  Name: "+name+"  Price: "+price+"  Stock: "+stock);
  const product = new Product({
    _id: id,
    name: name,
    price: price,
    stock: stock,
  });
  product.save();
  res.redirect("/");
});


/*  NODE JS LISTENER  */
app.listen(port, function() {
  console.log("Server started on port "+port);
});
