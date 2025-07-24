const express=  require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const app=express();
const bcrypt=require('bcrypt');
const path=require('path');
const PORT=3000;
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/appdb');
const userSchema= new mongoose.Schema({
    name:String,
    age:Number,
    password:String
})
const users=mongoose.model('users',userSchema);

app.use(express.json());
app.use(express.static('public'));
const arr=[];
app.get('/',(req,res)=>{
   res.sendFile(path.join(__dirname,'index.html'));
})

app.get('/pros',(req,res)=>{
    res.json('hlo');
})

app.post('/user',(req,res)=>{
    const data=req.body;
    arr.push(data);
    res.send(data);
})

app.post('/specify',async(req,res)=>{
    const hashed=await bcrypt.hash(req.body.password,10);
    const newuser={name:req.body.name,age:req.body.age,password:hashed}
    const user= new users(newuser);
    user.save()
       .then(data =>{
        res.json(data);
       })
       .catch(err=>{
        res.send(err);
    })
})

app.get('/base',(req,res)=>{
    users.find()
    .then(data=>{
        res.json(data);
    })
})
app.put('/update/67fc9d81a59996bc49b5f89b',(req,res)=>{
   const aid='67fc9d81a59996bc49b5f89b';
   const updatedata=req.body;
   users.findByIdAndUpdate(id,updatedata,{new:true})
   .then(data=>{
    res.json(data);
   })


})

app.delete('/delete/67fc9d81a59996bc49b5f89b',(req,res)=>{
    const id='67fc9d81a59996bc49b5f89b';
    users.findByIdAndDelete(id)
    .then(deletepost=>{
        res.json(deletepost);
    })
})

app.get('/data',(req,res)=>{
    res.json(arr);
})
app.get('/subdet',(req,res)=>{
    res.send("Thank you for Submission");
})

app.post('/user/login',async(req,res)=>{
    const user=await users.findOne({name:req.body.name});
    if(!user){
        return res.status(500).send('cannot find');
    }
    try{
        if(await bcrypt.compare(req.body.password,user.password)){
            res.status(200).json({name:req.body.name});
        }
        else{
            res.status(401).json({message:'not allowed'})
        }
    }
    catch{
        res.status(500).send();
    }
})
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})