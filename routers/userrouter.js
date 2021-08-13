const express=require("express");
const router=express.Router();
const Usercontroller=require("../Controller/Usercontroller");
router.get("/login",(req,res)=>
{
    err=req.flash("error-login");
    suc=req.flash("success");
    res.render("login",{err:err,suc:suc});
});
router.get("/register",(req,res)=>{res.render("register",{err:req.flash("error")})});
router.post("/login",Usercontroller.user_login);
router.post("/register",Usercontroller.user_register);
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Successfully Logged Out");
    res.redirect("/user/login");})
module.exports=router;