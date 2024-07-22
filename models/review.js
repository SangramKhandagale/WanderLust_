const { default: mongoose } = require("mongoose");
const moongoose=require("mongoose");
const Schema=moongoose.Schema;

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model("Review",reviewSchema);