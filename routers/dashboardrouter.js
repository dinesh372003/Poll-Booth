const express=require("express");
const router=express.Router();
const Dashboardcontroller=require("../Controller/Dashboardcontroller");

const database="mongodb+srv://Dinesh:Dinesh789@poll.em4re.mongodb.net/Task-3?retryWrites=true&w=majority";
router.get("/",Dashboardcontroller.dashboard);
router.get("/teams",Dashboardcontroller.teamslist);
router.get("/teams/join",Dashboardcontroller.jointeam);
router.post("/teams/join",Dashboardcontroller.jointeampost);
router.get("/teams/create",Dashboardcontroller.teampage);
router.post("/teams/create",Dashboardcontroller.createteam);
router.get("/teams/:team",Dashboardcontroller.polllist);
router.get("/teams/:teamname/createpoll",Dashboardcontroller.newpoll);
router.post("/teams/:teamname/createpoll",Dashboardcontroller.newpollpost)
//router.get("/teams/:teamname/share",Dashboardcontroller.share);
router.get("/teams/:teamname/:id",Dashboardcontroller.pollpage);
router.get("/teams/:teamname/:pollname/pollquestions",Dashboardcontroller.pollque);
router.post("/teams/:teamname/:pollname/pollquestions/next",Dashboardcontroller.pollquepost);
router.post("/teams/:teamname/:pollname/pollquestions/finish",Dashboardcontroller.pollquepostfin);
router.post("/teams/:teamname/:id",Dashboardcontroller.pollsubmit);
router.post("/teams/:teamname/:id/delete",Dashboardcontroller.endpoll)
module.exports= router;