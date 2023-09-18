const express = require("express")
const cors = require("cors")
const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const Conversation = require("./models/Conversation");
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()




require("./Db/connection");



app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


app.get("/", (req,res)=>{
    res.send("Vocab Master running on server")
})


// chat app



















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
    // await client.connect();


   const wordCollection = client.db("vocab-master").collection("word")
   const lessonCollection = client.db("vocab-master").collection("quizs")
   const usersCollection = client.db("vocab-master").collection("users")
   const quizCollection = client.db("vocab-master").collection("quiz")
   const issueCollection = client.db("vocab-master").collection("issue");
   const feedbackCollection = client.db("vocab-master").collection("feedback");



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


  //  app.get("/words", async(req, res)=>{

  //   const result = await wordCollection.find().toArray()
  //   res.send(result)
    
  //  });


   app.get("/words", async(req, res)=>{
     
          const result = await lessonCollection.find().toArray();
          res.send(result)
   })


   app.get("/quiz", async(req, res)=>{

    const search = req.query.search;

    const query = {word: { $regex: search, $options: "i"} };

    const result = await lessonCollection.find(query).toArray();

    res.send(result)

   })


   app.post("/issue", async(req, res)=>{

        const issue = req.body;
        console.log(issue);

        const result = await issueCollection.insertOne(issue);
        res.send(result)
   })


   app.get("/issue", async(req, res)=>{

       const result = await issueCollection.find().toArray();
       res.send(result)
   })



  //  app.get("/quizs", async(req, res)=>{
       
     
  //           const search = req.query.search;

  //           const query = {word: { $regex: search, $options: "i"} };

  //           const result = await lessonCollection.find(query).toArray();
  //           res.send(result)



  //  })

   app.delete("/word/:id", async(req, res)=>{
     const id = req.params.id;
     const query = {_id : new ObjectId(id)};
     const result = await lessonCollection.deleteOne(query);
     res.send(result)
   })

   app.get("/word/:id" , async(req,res)=>{
              
                 const id = req.params.id;
                 const query = {_id : new ObjectId(id)};
                 const result = await lessonCollection.find(query).toArray();
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
        console.log(data?.diamond);
        
        const updateDoc = {
                
            $set:{
                diamond : data?.diamond + 1
            }
        }

        const result = await usersCollection.updateOne(query, updateDoc)
        res.send(result)
   })


   app.patch("/singleUser/users/level", async(req, res)=>{
     
              const email = req.query.email;
              const query = { email : email};
 
              const data = req.body;

              console.log(data.season);

              const updateDoc = {
                     
                           $set : {
                              season : data?.season
                           }
              }

              const result = await usersCollection.updateOne(query, updateDoc);

              res.send(result);
   })



   app.post("/feedback", async(req, res)=> {


              const feedback = req.body;
              const result = await feedbackCollection.insertOne(feedback);
              res.send(result)
   })


   app.get("/feedback", async(req, res)=> {

           const result = await feedbackCollection.find().toArray();

           res.send(result)
   })


   app.patch("/feedback/show/:id", async(req, res)=>{
 
               const id = req.params.id;
               const query = {_id: new ObjectId(id)}

               const updateDoc = {
                   $set: {
                        show: true
                   }
               }
           
               const result = await feedbackCollection.updateOne(query, updateDoc);

               res.send(result)
   })



   app.get("/users/student", async(req, res)=>{


     const query = {role : "student"};
     
     const result = await usersCollection.find(query).sort({diamond: -1}).toArray();

     res.send(result);



   }); 


    app.put("/singleUser/firstSeasonMark/:email", async(req, res)=>{

          const email = req.params.email;
          const query = {email : email}

          const marks = req.body; 
          console.log(marks);
          const options = { upsert: true };
           const names = Object.keys(marks)[0]       
 
          const updateDoc = {
              $set : {
                   quizMarks: [
                        {
                           first : marks.first
                        }
                   ]
              }
          }


          const result = await usersCollection.updateOne(query, updateDoc, options);
          res.send(result)

        

    })



   app.get("/seasonQuiz", async(req, res)=>{


             const result = await quizCollection.find().toArray();
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


    
   app.put("/word/:id", async(req, res)=>{
     
              const id = req.params.id;
              const query = {_id: new ObjectId(id)};
              const updateData = req.body;
              const updateDoc ={
                  $set : {
                    word : updateData.word,
                    meaning : updateData.meaning,
                    category : updateData.category,
                  }
              }

              const result = await lessonCollection.updateOne(query, updateDoc);
              res.send(result)
   })


  //  chat app 

  app.post("/message/conversation", async(req, res)=>{



    try{
            const { senderId, receiverId } = req.body;
            
                console.log(req.body)
  
            const newConversation = new Conversation({ members: [senderId, receiverId]});
            await newConversation.save();
            res.status(200).send("Conversation created succesfully");
    }catch(err){
       console.log(`erro`, err);
    }
  })


 

  app.get("/message/conversation/:userId", async(req, res)=>{
       
    try{
      const userId = req.params.userId;
      const conversations = await Conversation.find({members: {$in: [userId]}});
      const conversationUser = Promise.all(conversations.map(async(conversation) => {
          const receiverId = conversation.members.find(member => member !== userId);
          const user =  await usersCollection.findOne(new ObjectId(receiverId));
          return { user: {email: user.email, name: user.name}, conversationId: conversation._id }
      }))
      res.status(200).json(await conversationUser);
    }catch(err){
         console.log(err, "err");
    }
})


   

   


   


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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