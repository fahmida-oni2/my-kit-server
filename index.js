const express = require('express')
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express()
const port = 5000
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pwy4qnn.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("kit-db");
    const kitCollection = db.collection("kit-collection");

     app.get("/all-kits", async (req, res) => {
      const result = await kitCollection.find().toArray();
      res.send(result);
    });
      app.post("/all-kits", async (req, res) => {
      const data = req.body;
      const result = await kitCollection.insertOne(data);
      res.send({
        success: true,
       insertedId: result.insertedId,
      });
    });

      app.get("/available-kits", async (req, res) => {
  const cursor = kitCollection
    .find()
    .sort({ stock_status: 1 }) 
    .limit(6);
  const result = await cursor.toArray();
  res.send(result);
});
    app.get("/all-kits/:kitId", async (req, res) => {
    const { kitId } = req.params;
    const objectId =  new ObjectId(kitId)
    const result = await kitCollection.findOne({ _id: objectId }); 

    res.send({
      success: true, 
      result,         
    });
    
});
 app.get("/my-kit", async (req, res) => {
      const email = req.query.email;
      const cursor = kitCollection.find({ creator_email: email });
      const result = await cursor.toArray();
      res.send(result);
    });
     app.put("/all-kits/:kitId", async (req, res) => {
      const {kitId} = req.params;
      const data = req.body;
      const objectId  = new ObjectId(kitId);
      delete data._id;

      const filter = { _id: objectId };
      const update = {
        $set: data,
      };
      const result = await kitCollection.updateOne(filter, update);

      res.send(result);
    });

      app.delete("/all-kits/:kitId", async (req, res) => {
      const { kitId } = req.params;
      const objectId = new ObjectId(kitId);

      const result = await kitCollection.deleteOne({
        _id: objectId,
      });

      res.send(result);
    });





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
