const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const TeamSchema=new Schema({
    teamname:
    {
        type:String,
    },
    admin:
    {
        type:[String],
    },
    members:
    {
        type:[String],
    },
    pollname:
    {
        type:[String],
    },
    teamcode:
    {
        type:String
    }
},{timestamps:true});
const Team=mongoose.model("Team",TeamSchema);
module.exports=Team;