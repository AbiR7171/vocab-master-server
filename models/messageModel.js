const mongoose = require("mongoose");



const MessageModel = mongoose.Schema({
      conversationId: {
         type: String,

      },
         senderId: {
             type: String
         },
         message:{
             type: String
         }

    });


const Messages = mongoose.model("Message", MessageModel);

module.exports = Messages; 