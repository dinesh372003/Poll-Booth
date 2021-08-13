const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const PollSchema=new Schema({
    teamname:
    {
        type:String
    },
    pollname:
    {
        type:String
    },
    Question:
    {
        type:Object
    },
    TotalQuestion:
    {
        type:Number
    },
    Count:
    {
        type:Object
    },
    people:
    {
        type: Array
    }

},{timestamps:true});
const Poll=mongoose.model("Poll",PollSchema);
module.exports=Poll;