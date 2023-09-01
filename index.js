const express = require("express")
const cors = require("cors")
const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()



app.use(cors())
app.use(express.json())


app.get("/", (req,res)=>{
    res.send("Vocab Master running on server")
})







const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_LOCK}@cluster0.hmmbger.mongodb.net/?retryWrites=true&w=majority`;

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


   const wordCollection = client.db("vocab-master").collection("word")
   const lessonCollection = client.db("vocab-master").collection("quizs")
   const usersCollection = client.db("vocab-master").collection("users")



   const verifyAdmin = async(req, res, next)=>{

           const email = req.decoded.email;

           console.log(req.decoded);

           const query = {email : email};
           const user = await usersCollection.findOne(query)

           if(user?.role !== "admin"){
              return res.status(403).send({error:true, message: "forbidden message"})
           };

           next()
   }


   app.get("/words", async(req, res)=>{

    const result = await wordCollection.find().toArray()
    res.send(result)
    
   })

   app.get("/quiz", async(req, res)=>{

            const result = await lessonCollection.find().toArray();
            res.send(result)
   })


   app.get("/lesson/category/TeaStall", async(req, res)=>{
           
               const query = {category : "Tea stall"};
               const result = await lessonCollection.find(query).toArray();
               res.send(result)

   })


   app.post("/users", async(req, res)=>{

              const user = req.body;

              // console.log(user);
              const result = await usersCollection.insertOne(user);
              res.send(result)
              
   })

   app.get("/users", async(req, res)=>{

          const result = await usersCollection.find().toArray()
          res.send(result)
   })


   app.get("/singleUser/users", async(req, res)=>{

          const email = req.query.email;
          console.log(email);
          const query =  {email : email};
          const result = await usersCollection.find(query).toArray();
          res.send(result)
   })

   app.patch("/singleUser/users", async(req, res)=>{

       const email = req.query.email;
       console.log(email);
       const query = { email : email};
       
        const data = req.body;
        console.log(data.diamond);
        
        const updateDoc = {
                
            $set:{
                diamond : data.diamond + 1
            }
        }

        const result = await usersCollection.updateOne(query, updateDoc)
        res.send(result)
   })



   app.get("/singleUser/users/admin",  async(req, res)=>{
            
               const email = req.query.email;

               const query = {email : email};

               const user = await usersCollection.findOne(query)
               
               const result = {admin : user?.role == "admin"}

               res.send(result)
   })


   app.patch("/singleUser/users/admin/:id", async(req, res)=>{

             const id =req.params.id;

             console.log(id);
             const query = {_id: new ObjectId(id)};

             const updateDoc = {
               $set :{
                 role : "admin"
               }
             }

             const result = await usersCollection.updateOne( query, updateDoc)

             res.send(result)

   })



   app.delete("/singleUser/users/:id", async(req, res)=>{

           const id = req.params.id;
           const query = {_id : new ObjectId(id)};
           const result = await usersCollection.deleteOne(query)

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





app.listen(port, ()=>{
    console.log(`vocab master server running on ${port}`);
})