const mongoCollections=require("../config/mongoCollections");
const users=mongoCollections.users;
const ObjectId = require('mongodb').ObjectId;

//get all users and their reviews
async function getAllUsersAndReviews(){
    const usersCollection=await users();
    const allUsers=await usersCollection.find({}).toArray();
    const allUsersList=[];
    for(let i=0;i<allUsers.length;i++){
        const reviewsList=[];
        if(allUsers[i].reviews){
            for(let j=0;j<allUsers[i].reviews.length;j++){
                let review={
                    reviewID:allUsers[i].reviews[j].reviewID,
                    reviewer_name:allUsers[i].reviews[j].reviewer_name,
                    reviewer_like:allUsers[i].reviews[j].reviewer_like,
                    review:allUsers[i].reviews[j].review
                }  
                reviewsList.push(review);
            }
            let content={
                _id:allUsers[i]._id,
                reviews:reviewsList
            }
            allUsersList.push(content);
        }else{
            let content={
                _id:allUsers[i]._id
            }
            allUsersList.push(content);
        } 
        
    }
    //console.log(allUsersList); 
    return allUsersList; 
}
// console.log(getAllUsersAndReviews().then(function(result){
//     console.log(result);
// }));

async function getReviewsByUserId(userId) {
    if(userId===undefined) throw "Please provide an restaurantId.";
    const usersCollection=await users();
    const theUser=await usersCollection.findOne({_id:ObjectId(userId)});
    if(!theUser || theUser===null) throw "No restaurant with that restaurantId.";
    const allReviews=theUser.reviews;
    const result=[];
    for(let i=0;i<allReviews.length;i++){
        let review={
            reviewID:allUsers[i].reviews[j].reviewID,
            reviewer_name:allUsers[i].reviews[j].reviewer_name,
            reviewer_like:allUsers[i].reviews[j].reviewer_like,
            review:allUsers[i].reviews[j].review
        } 
        result.push(review);   
    }  
    return result;   
}

async function deleteReview(id){
    if(!id) throw "No id provided.";
    const usersCollection=await users();
    const allUsers=await usersCollection.find({}).toArray();
    for(let i=0;i<allUsers.length;i++){
        const theReviews =await getReviewsByUserId(allUsers[i]._id);
        if (!theReviews) throw "No reviews found.";
        for(let j=0;j<theReviews.length;j++){
            if(theReviews[j]._id===id){
                let deleteReviewInUser=await usersCollection.update(
                    {_id:allUsers[i]._id},
                    {$pull:{'R_review':{_id:ObjectId(id)}}}
                )
                if(deleteReviewInUser.deleteCount===0) throw "Could not delete the review.";
            }
        }    
    }
    return "{delete review:true}";
}

//get all restaurants
async function getAllUsers(){
    const usersCollection=await users();
    const allUsers=await usersCollection.find({}).toArray();
    let usersList=[];
    for(let i=0;i<allUsers.length;i++){
        let content={
            _id:allUsers[i]._id,
            email:allUsers[i].local.email
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
module.exports={getAllUsersAndReviews,getReviewsByUserId,deleteReview,getUserByName,getAllUsers};