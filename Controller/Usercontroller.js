const user=require("../Schema/UserSchema.js")
const bcrypt=require("bcryptjs");
const passport=require("passport");



const user_login= (req, res, next) => 
{
    passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true
    })(req, res, next);
}




const user_register=(req,res)=>
{
    let flag=0;
    //Stroring in convinient variable
    const {name,email,password}=req.body;
    //Checking for a strong password
    if(password.length<8)
    {
        flag++;
        req.flash("error","Please enter a Strong Password");
    }
    user.find()
    .then(result=>
    {
        result.forEach(function(user)
        {
            if(user.email==email)
            {
                flag++;
                req.flash("error","Email Id already exists");
            }
        });
        if(flag==0)
        {
            const User= new user({name,email,password});
            //hashing  password
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(User.password,salt,(err,hash)=>
                {
                    if(err){console.log(err);}  
                    User.password=hash; 
                    User.save()
                        .then((result)=>{
                            req.flash("success","You have registered Successfully");
                            res.redirect("/user/login");})
                        .catch((err)=>console.log(err)) 
                })
            });  
        } 
        else
        {
            res.render("register",{name:name,email:email,err:req.flash().error});
        }
    



    })
    .catch(err=>console.log(err));

};

module.exports=
{
    user_login,
    user_register
    
};
