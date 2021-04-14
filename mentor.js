const express = require('express')
const app = express();
const cors = require("cors");
app.use(cors())
app.use(express.json());
app.listen(process.env.PORT || 4000);

let mentor=[];
let mc = 1 ; 
let students = [];
let sc =1;
app.post("/mentor",(req,res)=>{
    req.body.id = mc;
    mentor.push(req.body); 
    //console.log(mentor); 
    res.json({
        message : "Mentor created"
    })
    mc++;
})

app.post("/student",(req,res)=>{
    req.body.id = sc ; 
    students.push(req.body);
   // console.log(students);
    res.json({
        message : "Student created"
    })
    sc++;
})

app.put("/mentor/:id",(req,res)=>{
/*
        input data must be in below format
       {
           studentslist:[studentnames,....];
       }
*/ 

   let index = mentor.findIndex((obj)=>obj.id==req.params.id);
   req.body.studentslist.forEach((student) => {
       let stindex = students.findIndex((s)=>s.name==student);
       if(stindex!==-1)
       {
       mentor[index].students.push(students[stindex]);
       students[stindex].mentor_id = mentor[index].id;
       }
   });
   res.json(mentor);
})

app.put("/student/:id",(req,res)=>{

    /*
        input data must be in below format
       {
           name : "name of new mentor"
       }
*/ 

 let stdindex = students.findIndex((obj)=>obj.id==req.params.id);
 
 if(stdindex!=-1)
 {
    // console.log((Object.keys(students[stdindex]).findIndex((feild)=>feild=="mentor_id")))
 if((Object.keys(students[stdindex]).findIndex((feild)=>feild=="mentor_id"))!=-1)
 {
    let currentmentorindex = mentor.findIndex((ele)=>ele.id==students[stdindex].mentor_id);
    console.log(currentmentorindex);
    let studentindex = mentor[currentmentorindex].students.findIndex((ele)=>ele.id==req.params.id);
    mentor[currentmentorindex].students.splice(studentindex,1);
    let newmentorindex = mentor.findIndex((ele)=>ele.name==req.body.name);
    mentor[newmentorindex].students.push(students[stdindex]);
    students[stdindex].mentor_id=mentor[newmentorindex].id;
 }
 else
 {
    let newmentorindex = mentor.findIndex((ele)=>ele.name==req.body.name);
    mentor[newmentorindex].students.push(students[stdindex]);
    students[stdindex].mentor_id=mentor[newmentorindex].id;
 }
}
res.json(students[stdindex]);
})

app.get("/mentor",(req,res)=>{
    res.json(mentor);
})

app.get("/student",(req,res)=>{
    res.json(students);
})

app.get("/mentor/:id",(req,res)=>{
    let index = mentor.findIndex((obj)=>obj.id==req.params.id);
    res.send(mentor[index].students);  
})