const mongoose=require("mongoose");
const Users=require("../Schema/UserSchema");
const polls=require("../Schema/PollSchema");
const Teams=require("../Schema/TeamSchema")
const fetch=require("node-fetch");
var count;
var countid=0;


const dashboard=(req,res)=>
{
    res.render("dashboard",
    {
        User:req.user
    });
};



const teamslist=(req,res)=>
{
    res.render("teams",
    {
        User:req.user
    });
};


function teamcode()
{
    var teamcode="";
    const alphabets=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    for (var i=0;i<6;i++)
    {
        var a = Math.floor(Math.random()*26);
        teamcode+=alphabets[a];  
    }
    return teamcode;
}
const createteam=(req,res)=>
{
    mongoose.set('useFindAndModify', false);
    Users.findOneAndUpdate(
        {
            _id:req.user._id,
        },
        {$addToSet:
        {
            teams:req.body.teamname,
            admin:req.body.teamname,
        }})
        .then(result={})
        .catch(err=>console.log(err));
    const team=new Teams();
    team.admin=req.user.email;
    team.teamname=req.body.teamname;
    team.teamcode=teamcode();
    team.save()
    .then(result=>{res.redirect("/dashboard/teams");})
    .catch(err=>console.log(err));
};



const teampage=(req,res)=>
{
    res.render("createteam",
    {
        User:req.user
    });
}



const polllist=(req,res)=>
{
    const teamname=req.params.team;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    polls.find()
    .then(poll=>
    {
        Teams.find()
        .then(team=>
        {
            res.render("team.ejs",{poll:poll,User:req.user,teamname:teamname,team:team});
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
};



const newpoll=(req,res)=>
{
    const team=req.params.teamname;
    res.render("newpoll",{User:req.user,teamname:team,flag:0});
};



const jointeam=(req,res)=>
{
    res.render("jointeam",{User:req.user});
};




const jointeampost=(req,res)=>
{        
    req.body.teamcode=req.body.teamcode.trim(); 
    var teamname;
    mongoose.set('useFindAndModify', false);
    Teams.findOneAndUpdate(
        {
            teamcode:req.body.teamcode,
        },
        {
        $addToSet:
        {
            members:req.user.email,
        }
        })
        .then(result=>
        {
            Teams.find()
            .then(result=>
            {
                result.forEach(function(team)
                {
                    if(team.teamcode==req.body.teamcode)
                    {
                        teamname=team.teamname;
                    }
                })
                Users.findOneAndUpdate(
                    {
                        _id:req.user._id,
                    },
                    {
                    $addToSet:
                    {
                        teams:teamname,
                    }
                    })
                    .then(result=>res.redirect("/dashboard/teams"))
                    .catch(err=>console.log(err));
            })
            .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err));
};




const share=(req,res)=>
{
    const team=req.params.teamname;
    res.render("sharelink",{teamname:team,User:req.user});
};



const newpollpost=(req,res)=>
{
    var flag=0;
    const pollname=req.body.pollname;
    const teamname=req.params.teamname;
    polls.find()
    .then(result=>
    {
        result.forEach(function(result)
        {
            if((result.pollname==pollname)&&(result.teamname==teamname))
            {
                flag=1;
                res.render("pollmatches",
                {
                    User:req.user,
                    teamname:teamname,
                    pollname:pollname
                })
            }
        })
        if(flag==0)
        {
            const Poll=new polls()
            Poll.pollname=pollname;
            Poll.teamname=teamname;
            Poll.TotalQuestion=0;
            Poll.save()
            .then(result=>{})
            .catch(err=>console.log(err));
            Teams.findOneAndUpdate(
                {
                    teamname:teamname,
                },
                {
                    $push:
                    {
                        pollname:pollname,
                    },
                })
                .then(result=>
                {
                    res.redirect("/dashboard/teams/"+teamname+"/"+pollname+"/pollquestions");
                })
                .catch(err=>console.log(err));
            
        }
    
    })
    .catch(err=>console.log(err));
}
    


const pollque=(req,res)=>
{
    countid=0;
    count=1;
    const pollname=req.params.pollname;
    const teamname=req.params.teamname;
    res.render("pollquestions",
    {
    User:req.user,
    pollname:pollname,
    teamname:teamname,
    count:count
    })
};



const pollquepost=(req,res)=>
{
    const pollname=req.params.pollname;
    const teamname=req.params.teamname;
    count++;
    countid++;
    mongoose.set('useFindAndModify', false);
    polls.findOneAndUpdate(
        {
            pollname:pollname,
        },
        {
        $push:
        {
            Question:
            {
                "Questions":req.body.Question,
                "Option-1":req.body.Option1,
                "Option-2":req.body.Option2,
                "Option-3":req.body.Option3,
                "Option-4":req.body.Option4,
            },
            Count:
            {
                "id":countid,
                "Option-1":0,
                "Option-2":0,
                "Option-3":0,
                "Option-4":0,
            },
        },
        $inc:
        {
        TotalQuestion:1,
        },
        })
        .then(result=>
        {
            res.render("pollquestions",
            {
                User:req.user,
                pollname:pollname,
                teamname:teamname,
                count:count
            })
        })
        .catch(err=>console.log(err));
};



const pollquepostfin=(req,res)=>
{
    const pollname=req.params.pollname;
    const teamname=req.params.teamname;
    countid++;
    mongoose.set('useFindAndModify', false);
    polls.findOneAndUpdate(
        {
            pollname:pollname,
        },
        {
        $push:
        {
            Question:
            {
                "Questions":req.body.Question,
                "Option-1":req.body.Option1,
                "Option-2":req.body.Option2,
                "Option-3":req.body.Option3,
                "Option-4":req.body.Option4,
            },
            Count:
            {
                "id":countid,
                "Option-1":0,
                "Option-2":0,
                "Option-3":0,
                "Option-4":0,
            },
        },
        $inc:
        {
        TotalQuestion:1,
        },
        })
        .then(result=>{
            res.redirect("/dashboard/teams");
        })
        .catch(err=>console.log(err));
   
};



const pollpage=(req,res)=>
{
    var flag=0
    const teamname=req.params.teamname;
    const pollid=req.params.id;
    polls.findById(pollid)
    .then(poll=>
    {
        Users.findById(req.user.id)
        .then(user=>
        {
            user.admin.forEach(function(teams)
            {
                if(teams==poll.teamname)
                {
                    flag++;
                    return res.render("result",{User:req.user,poll:poll});
                    
            }
            })
            if(flag==0)
            {
                poll.people.forEach(function(people)
                {
                    if(people==req.user.email)
                    {
                        flag++;
                        return res.render("alreadyvoted",
                        {
                            User:req.user,
                            teamname:poll.teamname,
                        });
                    }
                })
                if(flag==0)
                {
                    return res.render("poll",
                    {
                        User:req.user,
                        poll:poll
                    });
                }
            }
        })
        .catch(err=>console.log(err))

    })
    .catch(err=>console.log(err));
};


const pollsubmit=(req,res)=>
{
    const pollid=req.params.id;
    var a=req.body;
    polls.findById(pollid)
    .then(poll=>
    {
    for(var i=0;i<poll.TotalQuestion;i++)
    {
        var optionno=a["Option-"+i];
        if(optionno==1)
        {
            polls.updateOne(
            {
                _id:pollid,
                "Count.id":i+1,
            },
            {
                $inc:
                {
                    "Count.$.Option-1":1,
                },    
            })
            .then(result=>{})
            .catch(err=>console.log(err));
        }


        else if(optionno==2)
        {
            polls.updateOne(
            {
                _id:pollid,
                "Count.id":i+1,
            },
            {
                $inc:
                {
                    "Count.$.Option-2":1,
                },    
            })
            .then(result=>{})
            .catch(err=>console.log(err));
        }


        else if(optionno==3)
        {
           polls.updateOne(
            {
                _id:pollid,
                "Count.id":i+1,
            },
            {
                $inc:
                {
                    "Count.$.Option-3":1,
                },    
            })
            .then(result=>{})
            .catch(err=>console.log(err));
        }


        else if(optionno==4)
        {
            polls.updateOne(
            {
                _id:pollid,
                "Count.id":i+1,
            },
            {
            $inc:
            {
                "Count.$.Option-4":1,
            },    
            })
            .then(result=>{})
            .catch(err=>console.log(err));
        }

    }
    polls.updateOne(
        {
            _id:pollid,
        },
        {
            $push:
            {
                people:req.user.email,
            },
        })
        .then(result=>
        {
            res.redirect("/dashboard/teams/"+req.params.teamname);
        })
        .catch(err=>comsole.log(err));

    })
    .catch(err=>console.log(err));
};



const endpoll=(req,res)=>
{
const pollid=req.params.id;
polls.deleteOne({
    _id:pollid
})
.then(result=>res.redirect("/dashboard/teams"))
.catch(err=>console.log(err));
// polls.findByIdAndDelete(pollid)
// .then(result=>
// {
//     res.json({redirect:"/dashboard"})    
// })
// .catch(err=>console.log(err));
};
module.exports={
dashboard,
teamslist,
createteam,
teampage,
polllist,
newpoll,
jointeam,
jointeampost,
share,
newpollpost,
pollque,
pollquepost,
pollquepostfin,
pollpage,
pollsubmit,
endpoll
};
