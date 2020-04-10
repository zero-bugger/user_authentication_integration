var express= require("express");
var mongoose=require("mongoose");
var passport= require("passport");
var User=require("./models/User");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var bodyparser=require("body-parser");
var app=express();


mongoose.connect("mongodb://localhost:27017/userauthapp",{useNewUrlParser:true});
app.set('view engine', 'ejs');
app.use(require("express-session")({
	secret:"krunal love programming",
	resave:false,
	saveUninitialized:false
}));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.urlencoded({extended:true}));





//--------------Routes---------------//

app.get("/",function(req,res){
	res.render("home");
});

app.get("/secret",isLoggedIn,function(req,res){
	res.render("secret");
})

//------------Auth Routes--------------//
//SignUP Route//
app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/secret");
		});
		
		
		
	});
});
//Login Route//
app.get("/login",function(req,res){
	res.render("login");
});


app.post("/login",passport.authenticate("local",{
	successRedirect:"/secret",
	failureRedirect:"/login"
}),function(req,res){
	
});

//Logout Route
app.get("/logout",function(req,res){
	
	req.logout();
	res.redirect("/");
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
	
}

app.listen(3000,function(){
	
	console.log("Server Started------------------->")
})