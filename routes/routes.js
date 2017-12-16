const router=require("express").Router();
const data=require("../data");
const restaurantsData=data.restaurants;
const reviewsData=data.reviews;
//add Users data
const User=require("../data/users");
const Usr=require("../data/user");


module.exports = function(app, passport) {  
        // show the home page (will also have our login links)
        app.get('/', async function(req, res) {
            try{
                const theRestaurants=await restaurantsData.getSome();
                res.render('./restaurants/restaurants', {
                    theRestaurants:theRestaurants
                });   
            }catch(e){
                console.log(e);
                res.redirect('/restaurants');
            }   
        });
    
        // PROFILE SECTION =========================
        app.get('/profile', isLoggedIn, async function(req, res) {
            try{
                const reviews = await reviewsData.getReviewsByUserId(req.user._id)
                if(!reviews){
                    res.render('profile',{user : req.user})
                                    }else{
                                        res.render('profile', {
                                           user : req.user,
                                           reviews:reviews
                                       });
                                   }
                }catch(e){
                    console.log(e);
                    res.redirect('/');
                }
        });
    
        // LOGOUT ==============================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
    
   
    
    
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
            //=============to enter adminProfile==============
        app.get('/ADM',(req,res)=>{
            if(req.user.local.email==='admin'){
                res.render('admin/adminProfile',{});
            }else{
                res.render('login', { message: req.flash('errorMessage') });
            }
        });

        //================get adminProfile==========
        app.get('/adminProfile', isLoggedIn, function(req, res) {
            if(req.user) res.render('admin/userSearch',{});
            else{
                res.render('login')
            }
        }); 
                
        //=============find a user to userSearch page==========         
        app.post('/result',(req,res)=>{
            if(req.user){
                Usr.findOne({'local.email' :  req.body.keyword},(err,user)=>{
                    if(user.length!=0) res.render('admin/userSearch',{user:user});
                    else res.render('body/result_err',{})
                });
            }else {
                res.redirect('/login')
            };
        });


        //===========delete reviews===================
        app.get('/deletereviews',async (req,res)=>{
            try{
                const all=await User.getAllUsersAndReviews();
                res.render('./restaurants/restaurants', {
                    all:all
                });   
            }catch(e){
                console.log(e);
                res.redirect('/restaurants');
            }
            
        })

    //     app.get('/deletereviews',async (req,res)=>{
    //         if(req.user){
    //             //===========
    //             User.getAllUsers().then((allusers)=>{
    //                 let usernamelist=[];
    //                 const len=User.getAllUsers().length;
    //                   return {
    //                       usernamelist:usernamelist,
    //                       len:len
    //                   };         
    //             }).then((test1)=>{
    //                 for(var i=0;i<test1.len;i++){
    //                     test1.usernamelist.push(allusers[i]._id);
    //                 } 
    //                 return test1;
    //             }).then((test1)=>{
    //                 let reviewlist=[];
    //                 const test2={
    //                     reviewlist:reviewlist,
    //                     usernamelist:test1.usernamelist,
    //                     len:test1.len
    //                 };return test2;
    //             }

    //             ).then((test2)=>{
    //                 for(var i=0;i<test2.len;i++){
    //                     reviewsData.getReviewsByUserId(test2.usernamelist[i]).then((reviewofuserlist)=>{
    //                         const len2=reviewsData.getReviewsByUserId(test2.usernamelist[i]).length;
    //                         return {
    //                             reviewofuserlist:reviewofuserlist,
    //                             len2:len2
    //                         }
    //                     }).then((arr1)=>{
    //                     for(var j=0;j<arr1.len2;j++){
    //                         const reviewItem=arr1.reviewofuserlist[j];
    //                         test2.reviewlist.push(reviewItem);
    //                     }
    //                     })
    //                     //==================
    //                 }
    //                 return test2.reviewlist;
    //             })
    //             .then((reviewlist)=>{

    //                 res.render('admin/deletereviews',{reviewlist:reviewlist});
    //             })
    //             }else res.redirect('/login');  
    //             }


        //show userlist here
        //===============find all users====================     
        app.get('/userList',(req,res)=>{
            if(req.user){
                User.getAllUsers().then((list)=>{
                    res.render('admin/userList',{list:list});
                })
                }else res.redirect('/login');  
                }
        );
            
        
        // route middleware to ensure user is logged in
        function isLoggedIn(req, res, next) {
            if (req.isAuthenticated())
                return next();
        
            res.redirect('/login');
        }
}