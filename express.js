const express = require('express');
const path = require('path');
const app =express();
const multer = require('multer');
const mongoose= require('mongoose');
const port= 3000 || process.env.PORT;
app.use(express.json());
app.use(express.static('public'));
mongoose.connect('mongodb://mongo:27017/appdb');

const userschema = mongoose.Schema({
    filename:String,
    mimetype:String,
    size:Number,
    data:buffer,
    uploadedAt:{
        type:Date,
        default:Date.now
    }

})


const Dog = mongoose.model('Dog',userschema);
const storage= multer.memoryStorage();

const upload = multer({storage});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
})
app.post('/upload',upload.single('file'),async(req,res)=>{
    try{
        const file = new Dog({
        filename:req.file.originalname,
        mimetype:req.file.mimetype,
         size:req.file.size,
        data: req.file.buffer
       
    })

    await file.save();
        res.json({message:"file uploaded"});
    }catch(err){
        res.json({message:"file not uploaded"});
    }
    

    


});

app.listen(port,'0.0.0.0',()=>{
    console.log("server is running");
})

