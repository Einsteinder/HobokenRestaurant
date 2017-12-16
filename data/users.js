const mongoCollections=require("../config/mongoCollections");
const users=mongoCollections.users;
const ObjectId = require('mongodb').ObjectId;

//get all restaurants
async function getAllUsers(){
    const usersCollection=await users();
    const allUsers=await usersCollection.find({}).toArray();
    let usersList=[];
    for(let i=0;i<allUsers.length;i++){
        let content={
            _id:allUsers[i]._id,
            email:allUsers[i].local.email,
            review:allUsers[i].review,
        }
        usersList.push(content);
    }
    return usersList; 
}



//get the restaurant 
async function getUserByName(name){
    if(name===undefined) throw "Please provide an name.";
    //const restaurantsCollection=await restaurants();
    const theUsers=await this.getAllUsers();
    if(!theUsers) throw "can not get theUsers."
    for(let i=0;i<theUsers.length;i++){
        if(theUsers[i].email===name){
            return theUsers[i];   
        }        
    }
}


module.exports={getUserByName,getAllUsers};