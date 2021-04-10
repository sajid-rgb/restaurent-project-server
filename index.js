const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 5000;
const app=express()
const dotenv = require('dotenv')
dotenv.config()
app.use(cors())
app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q4fxv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("foods").collection("foodstore");
  const cartCollection = client.db("foods").collection("cartstore");
  console.log('connected');
   app.post('/addFoods',(req,res) => {
       const foods = req.body
       collection.insertOne(foods)
   })

   app.get('/foods',(req,res)=>{
    collection.find({}).toArray((err,documents)=>{
        res.send(documents)
    })
})

app.get('/food',(req,res)=>{
    console.log(req.query.search);
    collection.find({name:{$regex:req.query.search}}).toArray((err,documents)=>{
        res.send(documents)
    })
})

app.get('/foods/:id',(req,res)=>{
    collection.find({_id:ObjectID(req.params.id)}).toArray((err,documents)=>{
        res.send(documents)
    })
})

app.post('/addOrders',(req,res) => {
    const carts = req.body
    cartCollection.insertOne(carts)
    .then(result=>console.log(result))
})
app.get('/orders',(req,res)=>{
    cartCollection.find({}).toArray((err,documents)=>{
        res.send(documents)
    })
})
app.delete('/delete/:id',(req,res)=>{
    const deleteItem = req.params.id
    cartCollection.findOneAndDelete({_id:ObjectID(deleteItem)})
})
app.delete('/deleteAll/:email',(req,res)=>{
    cartCollection.deleteMany({email:req.params.email})
})

});


app.listen(process.env.PORT || port,()=>console.log('Welcome'))