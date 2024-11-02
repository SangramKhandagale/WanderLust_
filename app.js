const express=require("express");
const app=express();
const port=3000;
const path=require("path");
const mongoose=require("mongoose");
const listing = require("./models/listing");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapasync=require("./utils/wrapasync");
const ExpressError=require("./utils/expresserror");
const session=require("express-session");
const flash=require("connect-flash");
const LocalStrategy=require("passport-local");
// const User=require("./models/user.js");
const passport = require("passport");
const user = require("./models/user.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("._method"));
app.engine("ejs",ejsmate);

main().then(()=>{
    console.log("Well done my boy")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://khandagalesangram26:6cECN7aXLJOpxvyo@cluster0.9snlg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}

const sessionOptions={
    secret:"mysupersecretcode",
    resave:"false",
    saveInitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxage:7*24*60*60*1000,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get("/demouser",async(req,res)=>{
    let fake=new User({
        email:"student@gmail.com",
        username:"venom"
    });
    await User.register(fake,"helloworld111");
   
    
})

app.get("/",(req,res)=>{
   res.render("main.ejs");
})

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    next();
})

app.get("/signup",(req,res)=>{
   res.render("signup.ejs");
});

app.post("/signup",wrapasync(async(req,res)=>{
   try{
    let {username,email,password}=req.body;
    const newuser=new user({email,username});
    const registerdUser=await user.register(newuser,password);
    console.log(registerdUser);
    res.redirect("/listings");
   }catch{
    
req.flash("error",Username);
res.redirect("/signup");
   }
}));

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});

//  app.post("/login",wrapasync(async(req,res)=>{
//     let{username,password}=req.body;
//     res.redirect("/listings");
//  }))

 app.post("/login",async(req,res)=>{
     res.redirect("/listings");
 })


app.get("/listings",wrapasync(async (req,res)=>{
   const allListings=await listing.find({});
   res.render("P1.ejs",{allListings});
    }))

app.get("/listings/new",(req,res)=>{
        res.render("new.ejs")
    })

    app.post("/listings",wrapasync(async(req,res)=>{
const newlisting=new listing(req.body.listing);
await newlisting.save();
req.flash("success","New Listing Formed");
res.redirect("/listings"); 
}));

app.get("/listings/:id/edit",wrapasync(async (req,res)=>{
    let {id}=req.params;
    const Listing= await listing.findById(id);
   res.render("edit.ejs",{ Listing });
}))


app.get("/listings/:id",wrapasync(async(req,res)=>{
        let {id}=req.params;
       const Listing= await listing.findById(id);
       res.render("P2.ejs",{Listing})
    }))

    app.post("/listings/:id",wrapasync(async(req,res)=>{
        let {id}=req.params;
      await listing.findByIdAndUpdate(id,{...req.body.listing});
      res.redirect(`/listings/${id}`); 
    }))

    app.delete("/listings/:id",async(req,res)=>{
        let {id}=req.params;
        let deleted= await listing.findByIdAndDelete(id);
        console.log(deleted);
        res.redirect("/listings");
    })

    app.all("*",(req,res,next)=>{
        next(new ExpressError(404,"You fucked up")) 
    })

app.use((err,req,res,next)=>{
let{statusCode=500,message="You fucked up"}=err;
res.render("error.ejs",{message});
})

    app.listen(port,()=>{
    console.log("Listening to port");
})
