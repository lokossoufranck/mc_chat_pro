const mongoose =require('mongoose');
var CounterShema=mongoose.Schema();
module.exports=mongoose.model('Counters',CounterShema);