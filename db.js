const mongoose=require('mongoose');
const mongoURI="mongodb+srv://rishabhk5236:rish2023%40gmail.com@cluster1.etkfh6n.mongodb.net/SecretFriend";

const connectToMongo=()=>{

    try{
        mongoose.connect(mongoURI,()=>{
            console.log("Connected to mongo");
        });
    }
    catch(err){
        console.log("Unable to Connect with mongodb"+err);
    }
}

mongoose.set('strictQuery', false);

module.exports=connectToMongo;
