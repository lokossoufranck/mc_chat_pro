const mongoose =require('mongoose');
var OutputMessageShema=mongoose.Schema({
    id:{type:Number,require:false},
    body:{type:String,required:false},
    type:{type:String,required:false},
    contacts:{type: []},
    filename:{type:String,required:false},
    mimetype:{type:String,required:false},
    length:{type:Number,required:false},
    has_media:{type:Boolean,required:false},
    wp_number_sender:{type:String,required:false},
    wp_number_receiver:{type:String,required:false},
    discussion_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Discussions'},
    user_id:{type:mongoose.Schema.Types.ObjectId, ref: 'users'},
    is_read:{type:String,required:false},
    created_at:{type:Date,default: Date.now,required:false},
    updated_at:{type:String,required:false},
});

module.exports=mongoose.model('Outputmessages',OutputMessageShema);
