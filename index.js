if (process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

const express=require('express');
const app=express();
const path=require('path');
const {v4:uuid}=require('uuid');
uuid();
const methodOverride=require('method-override');
const mongoose=require('mongoose');
const Enquiry=require('./models/enquiry')
const ejsMate=require('ejs-mate');
const Joi=require('joi');
const flash=require('connect-flash');
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const { enquirySchema } = require('./schema');
const multer=require('multer');
const {storage}=require('./cloudinary');
const upload=multer({storage});
const dbUrl=process.env.DB_URL||'mongodb://localhost:27017/portfolioEnquiry';

const session = require('express-session');
const MongoStore = require('connect-mongo');

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
    .then(()=>{
        console.log("Connencted to mongoose")
    })
    .catch(err=>{
        console.log("OHNO!")
        console.log(err)
    })

// mongoose.connect('mongodb://localhost:27017/portfolioEnquiry')
//     .then(()=>{
//         console.log("Connencted to mongoose")
//     })
//     .catch(err=>{
//         console.log("OHNO!")
//         console.log(err)
//     })

// const store= new MongoStore({
//     url:dbUrl,
//     secret:'mollyspetshop',
//     touchAfter:24*60*60
// });

// store.on("error", function(e){
//     console.log('SESSION STORE ERROR',e)
// })

const sessionConfig={
    name:'session',
    secret:'mollyspetshop',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpyOnly:true,
        //secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.engine('ejs',ejsMate)
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))
app.use(methodOverride('_method'));
app.use(flash());
app.use(session(sessionConfig));
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

// let touch=[{
//     id:uuid(),
//     name:'Molly',
//     email:'molly@molly.com',
//     number:'+82-1040218492',
//     enquiry:'This is an example enquiry'
    
// }]

const validateEnquiry=(req,res,next)=>{
    const {error}=enquirySchema.validate(req.body);
    if (error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    } else {
        next();
    }
}

app.get('/',(req,res)=>{
    res.render('index')
})

app.post('/',catchAsync(async(req,res,next)=>{
    // const{name,email,number,enquiry}=req.body;
    // touch.push({name,email,number,enquiry,id:uuid()})
    const enquiry=new Enquiry(req.body);
    await enquiry.save();
    res.redirect('/')
}))

app.get('/:id',catchAsync(async(req,res,next)=>{
    const enquiry=await Enquiry.findById(req.params.id)
    res.render('show',{enquiry})
}))

app.delete('/:id', catchAsync(async (req, res,next) => {
    const { id } = req.params;
    await Enquiry.findByIdAndDelete(id);
    res.redirect('/');
}));

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const{statusCode=500,message="Something Went Wrong"}=err;
    if(!err.message)err.message="Sometihng Went Wrong"
    res.status(statusCode).render('error',{err});
})


const port=process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`port ${port}`)
})