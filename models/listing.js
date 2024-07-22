const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingShema=new Schema({
    title:{type:String,
        required:true
    },
    description:{type:String,
        required:true
    },
   image:{
    type:String,
    type:String
   },
    price:{type:String,
        required:true
    },
    location:{type:String,
        required:true
    },
    country:{type:String,
        required:true
    },
})

const listing=mongoose.model("listing",listingShema);

module.exports=listing;