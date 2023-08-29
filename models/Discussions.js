const mongoose =require('mongoose');
var DiscussionShema=mongoose.Schema({
    id:{type:Number,require:false},
    is_open:{type:Boolean,require:false},
    etat:{type:Number,require:false},
    created_at:{type:Date,default: Date.now,required:false},
    updated_at:{type:String,required:false},
});
module.exports=mongoose.model('Discussions',DiscussionShema);