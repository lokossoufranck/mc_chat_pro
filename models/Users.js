const mongoose =require('mongoose');
var UserShema=mongoose.Schema({
    id:{type:Number,require:false},
    name:{type:String,require:false},
    firstname:{type:String,require:false},
    email:{type:String,required:false},
    username:{type:String,required:false},
    email_verified_at:{type:Date,default: Date.now,required:false},
    password:{type:String,required:true},
    is_on_line:{type:Boolean,require:false},
    lastdate_connexion:{type:Date,default: Date.now,required:false},
    lastdate_attribution:{type:Date,default: Date.now,required:false},
    remember_token:{type:String,required:false},
    created_at:{type:Date,default: Date.now,required:false},
    updated_at:{type:String,required:false},
});

module.exports=mongoose.model('Users',UserShema);