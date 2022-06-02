let express=require('express');
const app= express();
const mongoose=require('mongoose')
const cors=require('cors')
const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(cors({origin:'*'}))

const URL='mongodb+srv://JayFab200:o8o88379502@cluster0.qtfme.mongodb.net/quiz_project?retryWrites=true&w=majority';

mongoose.connect(URL,(err)=>{
    if(err){
        console.log('Error in Connection')
    }else{
        console.log('succesful connected to database')
    }
    })


let studentSchema=mongoose.Schema({
	studentName:{type:String,
        required:true},
	email:{type:String,
        required:true},
	password:{type:String,
        required:true},
        score:{type:String,
            default:'NA'
          }
})
const studentModel=mongoose.model('student_tb',studentSchema)



let adminSchema=mongoose.Schema({
	email:{type:String,
        required:true},
	password:{type:String,
        required:true}       
})
const adminModel=mongoose.model('admin_info',adminSchema)



let questionSchema=mongoose.Schema({
question:String,
answers:[
    {option:String,index:Number},
    {option:String,index:Number},
    {option:String,index:Number},
    {option:String,index:Number}
],
correct:{type:Number,required:true}
})
const questionModel=mongoose.model('questions',questionSchema)


let settingSchema=mongoose.Schema({
	time:Number,
length:Number
})
const settingModel=mongoose.model('settings',settingSchema)

app.get('/', (req,res)=>{
    res.send('BACKEND WORKING')
    console.log('BACKEND IS GOOD')
} )

app.post('/registerStudent', (req,res)=>{
   let studentInfo=req.body
   let form = new studentModel(studentInfo)
   console.log(studentInfo)
form.save((err)=>{
   if(err){
       console.log(err)
 res.send(JSON.stringify({status:err,message:'Operation Failed',response:false}))
}
else{
getStudentDetails(studentInfo.email,res)
 }
})
})


app.post('/adminlogin', (req,res)=>{
let param=req.body.email
 adminModel.find({email:param},(err,result)=>{
        if(!result[0]){
       
            res.send(JSON.stringify({response:false,message:'type the correct email address'}))
        }
       else{

   res.send(JSON.stringify({data:result[0],response:true,message:'Operation successful'}))                 
 }
   })  
 })

 app.post('/addquestion', (req,res)=>{
    let form = new questionModel(req.body)
 
 form.save((err)=>{
    if(err){
        console.log(err)
  res.send(JSON.stringify({status:err,message:'Operation Failed',response:false}))
 }
 else{
     res.send(JSON.stringify({response:true,message:'Operation successful'})) 
  }
 })
 })

 app.post('/updatequestion', (req,res)=>{
     let data= req.body
questionModel.findByIdAndUpdate(data._id,data,(err,result)=>{
if(err){
    res.send(JSON.stringify({status:err,message:'Operation Failed',response:false}))
}
else{
    res.send(JSON.stringify({response:true,message:'Operation successful'})) 

}

})} )




app.post('/deletequestion', (req,res)=>{
    let data= req.body
questionModel.deleteOne({_id:data._id},(err,result)=>{
if(err){
   res.send(JSON.stringify({status:err,message:'Operation Failed',response:false}))
}
else{
   res.send(JSON.stringify({response:true,message:'Operation successful'})) 

}

})} )



 app.get('/getquestions', (req,res)=>{
     questionModel.find(
         (err,result)=>{
             if(err){
                res.send(JSON.stringify({status:err,message:'Operation Failed',response:false}))
             }
             else{
                res.send(JSON.stringify(result))

             }
         }
     )
 })
 
 app.get('/getsettings', (req,res)=>{
    settingModel.find(
        (err,result)=>{
            if(err){
               res.send(JSON.stringify({status:err,message:'Operation Failed',response:false}))
            }
            else{
                result=result[result.length-1]
               res.send(JSON.stringify(result))

            }
        }
    )})

    app.get('/results', (req,res)=>{
        studentModel.find(
            (err,result)=>{
                if(err){
                   res.send(JSON.stringify({status:err,message:'Operation Failed',response:false}))
                }
                else{
                   res.send(JSON.stringify(result))
                    }
            }
        )})
    


 app.post('/addsetting', (req,res)=>{
    let settingInfo=req.body
    let form = new settingModel(settingInfo)
 form.save((err)=>{
    if(err){
        console.log(err)
  res.send(JSON.stringify({status:err,message:'Operation Failed',response:false}))
 }
 else{
     res.send(JSON.stringify({response:true,message:'Operation successful'}))
 
  }
 })
 })
 
 async function getStudentDetails(param,res) {

    await studentModel.find({email:param},(err,result)=>{
         if(err){
             console.log(err)
         }
        else{
            console.log(result[0])
    res.send(JSON.stringify({data:result[0],response:true,message:'Operation successful'}))

                  
              }
    })
     
 }
 
 app.post('/updatestudent', (req,res)=>{
    let data= req.body
studentModel.findByIdAndUpdate(data._id,data,(err,result)=>{
if(err){
   res.send(JSON.stringify({status:err,message:'Operation Failed',response:false}))
}
else{
    console.log(result)
   res.send(JSON.stringify({response:true,message:'Operation successful'})) 

}

})} )


app.listen(5000,()=>{
	console.log('running on port 5000');
})