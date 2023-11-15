require('dotenv').config();
const express = require('express');
const app = express();
const port = 8000 || process.env.PORT;
const path = require('path');
const hbs = require('hbs');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); //middleware
const auth = require('./middleware/auth');
const server = app.listen(port , () => console.log(`listening to port ${port}`));
const io = require('socket.io')(server);
const limiter = require('express-rate-limit');
require('./db/conn');

// limiter
app.use(limiter({
    windowMs : 5000 ,
    max : 20
})) //max 20 req in 5 seconds

const footballModel = require('./models/register');
// paths
const staticPath = path.join(__dirname, "../public");
// console.log(`static path -> ${staticPath}`);
const template_path = path.join(__dirname, "../templates/views");
// console.log(template_path);
const partials_path = path.join(__dirname, "../templates/partials");
// console.log(partials_path);

// read JSON files
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

// middlewares
app.set('view engine', 'hbs');
app.set("views", template_path);
hbs.registerPartials(partials_path);
// static files
app.use(express.static(staticPath));


// routes
app.get('/',(req,res) => {
    res.render('index');
})
app.get('/standings',(req,res) => {
    res.render('standings');
})
app.get('/gallery',(req,res)=>{
    res.render('gallery');
})
app.get('/leagues-epl',(req,res)=>{
    res.render('epl');
})
app.get('/leagues-laliga',(req,res)=>{
    res.render('laliga');
})
app.get('/leagues-uefa',(req,res)=>{
    res.render('uefa');
})
app.get('/leagues-isl',(req,res)=>{
    res.render('isl');
})
app.get('/leagues-bundesliga',(req,res)=>{
    res.render('bundesliga');
})
app.get('/leagues-seriea',(req,res)=>{
    res.render('seriea');
})
app.get('/register' , (req , res)=>{
   res.render('register');
})
app.get('/login' , (req , res)=>{
    res.render('login');
 })
app.get('/secret' , auth ,(req , res)=>{
   res.render('secret');
})
app.get('/logout' , auth ,async (req , res)=>{
    try {
        console.log(req.user);
        res.clearCookie("jwt");
        console.log("user logged out success");
        await req.user.save();
        res.render("index");
    } catch (error) {
        res.status(500).send(error);
    }
 })
 app.get('/chat' , auth ,(req , res)=>{
    res.render('chat');
 })

// console.log(process.env.API_KEY); 

// sign up post using form post method
app.post('/register' , async(req , res)=>{
try {
    // console.log(req.body.username);
    // console.log(req.body.email);
    // console.log(req.body.phone);
    // console.log(req.body.password);
    // console.log(req.body.confirmpassword);
    // console.log(req.body.country);

    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if(password===cpassword){
        const registerFan = new footballModel({
            username : req.body.username,
            email : req.body.email,
            phone : req.body.phone,
            password : password,
            confirmpassword : cpassword,
            country : req.body.country
        })

        // hashing middleware using bcrypt defined in schema file

        // now after hash jwtOauth for that user using middleware
         const token = await registerFan.generateAuthToken(); //registerFan is not a collection,it is an instance
        // console.log(`token from app.js ${token}`);        //so when working with instance ,we use methods function in schema
        
        // now the token has been generated , we store it inside cookie
        // res.cookie(name,token_value,[options]) the value part could be string or object converted to JSON.
        res.cookie("jwt", token, {
            expires : new Date(Date.now() + 3000000000000),
            httpOnly : true
        }); //httponly -> allows cookie to be unchanged by client , 30 second after cookie auto delete
        // console.log(cookie);

        // register into db
        const savedFan = await registerFan.save();                      
        // console.log(savedFan);
        res.status(201).render("index");
    }
    else{
        res.send("passwords not matching!")
    }
} catch (error) {
    res.status(404).send(error);
}
})

// login
app.post('/login' ,async (req , res)=>{
    try {
        
    // console.log(req.body.email);
    // console.log(req.body.password);
    
    const password = req.body.password;
    const email = req.body.email;
    
    userLog = req.body.email;

    const fan = await footballModel.findOne({email:email});
    // console.log(fan);

    const fanpassword = fan.password; //password stored in database of that user
    // console.log(fanpassword);

    // bcrypt check for password
    // console.log(fanpassword);
    // console.log(password);
    const isMatching = await bcryptjs.compare(password,fanpassword); //first arg should be logintime pass and second hashed one
    // console.log(isMatching);

    // after login each time a auth is generated
    const token = await fan.generateAuthToken(); //fan is an instance of the userdata
    // console.log(`token from app.js ${token}`); 

    // now token inside cookie
    const cookie = res.cookie("jwt", token, {
        expires : new Date(Date.now() + 3000000),
        httpOnly : true
    });

    // now getting or reading cookies
    // console.log(`cookie values -> ${req.cookies.jwt}`);

    if(isMatching){
        // res.status(201).render("secret");
        res.status(201).redirect('/secret');
    }else{
        res.status(404).send('invalid email or password');
    }
    } catch (error) {
        res.status(404).send('Invalid Login ! Check Credentials');
    }
})
    

// forum socket
let socketConnected = new Set();

io.on('connection',onConnection);
async function onConnection(socket) {
    console.log('a user connected ',socket.id);
    socketConnected.add(socket.id);
    // console.log(socketConnected);
    //user total
    io.emit('total-clients',socketConnected.size);
    
    // recieving message for broadcast
    socket.on('message',(data) => {
        // console.log(data);
        socket.broadcast.emit('chat-message',data);    
    })

    // disconnect
    socket.on('disconnect',() => {
        console.log(`user disconnected ${socket.id}`);
        socketConnected.delete(socket.id);
        // user total after diconnect
        io.emit('total-clients',socketConnected.size);
    })

    // feedback typing message
    socket.on('feedback',(data) => {
        // console.log(data);
        socket.broadcast.emit('feedbackAfterBroadCast',data);
    })
}