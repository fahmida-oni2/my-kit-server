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
    app.get("/all-kits/:kitId", async (req, res) => {
    const { kitId } = req.params;
    const objectId =  new ObjectId(kitId)
    const result = await kitCollection.findOne({ _id: objectId }); 

    res.send({
      success: true, 
      result,         
    });
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
