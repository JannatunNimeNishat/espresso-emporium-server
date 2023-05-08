const express = require('express')

const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//securing the mongodb credentials
require('dotenv').config()

const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())




/* console.log(process.env.DB_USER);
console.log(process.env.DB_PASS); */



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oth2isl.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //db name and collection name
    const coffeeCollection = client.db('coffeeDB').collection('coffee')
                              //  CRUD
    //post data to database (CREATE)
    app.post('/coffee', async(req,res)=>{
      console.log('reached at coffee');
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      // console.log(result);
      res.send(result);
    })


    //Read data from database (READ)
    app.get('/coffee', async(req,res)=>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

      //get a specific coffee
      app.get('/coffee/:id', async(req,res)=>{
        const id = req.params.id;
        console.log(id);
        const query = {_id: new ObjectId(id)}
        const result = await  coffeeCollection.findOne(query)
        //console.log(result);
        res.send(result);
    })
 
    //update a specific coffee (UPDATE)
    app.put('/coffee/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
          test: updatedCoffee.test,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options)  
      res.send(result)

    })

    //delete from coffee (DELETE)
    app.delete('/coffee/:id', async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
    })

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req,res)=>{
    res.send('Coffee making Server is running')
})


app.listen(port, ()=>{
    console.log(`Coffee Server is running at ${port}`);
})




