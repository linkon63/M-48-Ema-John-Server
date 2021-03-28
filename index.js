const express = require('express');
require('dotenv').config();
const port = 5000;
// const bodyParser = require('body-parser');
const bodyParser = require('body-parser')
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://emaJohn:emajhon123456@cluster0.ci2re.mongodb.net/emaJhonStore?retryWrites=true&w=majority`;
const uri = "mongodb+srv://emaJohnStore:emaJohnStore123@cluster0.ci2re.mongodb.net/emaJohnStore?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/',(req,res) => {
    res.send('Welcome to BackEnd');
})

client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products"); //Products Collection In Database
  const ordersCollection = client.db("emaJohnStore").collection("orders"); // Ordered Collection in DataBase
  console.log('DataBase Connected With MongoDB');  

  //Insert Data in DB
  app.post('/addProduct', (req,res) => {
      const products = req.body;
      console.log(products);
      productsCollection.insertOne(products)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount);
      })
  })
  //Reading Data from DB
  app.get('/products', (req,res) => {
      productsCollection.find({})
      .toArray( (err,documents) => {
        res.send(documents);
      })
  })
  //Reading Single Data from DB
  app.get('/product/:key', (req,res) => {
      productsCollection.find({key: req.params.key})
      .toArray( (err,documents) => {
        res.send(documents[0]);
      })
  })
  //Reading Many Data from DB
  app.post('/productsByKeys', (req,res) => {
      const productKeys = req.body;
      productsCollection.find({key: {$in: productKeys}})
      .toArray((err,documents) => {
          res.send(documents);
      })
  })
    //Insert Place Order Data in DB
    app.post('/addOrder', (req,res) => {
        const order = req.body;
        console.log(order);
        ordersCollection.insertOne(order)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
        })
    })

});

  
app.listen(process.env.PORT || port)