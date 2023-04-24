const express = require('express');
const app = express();
const mongoose = require('mongoose');
const CourseData = require('./models/course_data.js')
// const CourseStudent = require('./models/course_student.js')

const LoginData = require('./models/login_data.js');
let userid = "";

const DBURL = 'mongodb+srv://amal:1234@cluster0.dyarnul.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(DBURL)
.then(result =>{console.log('connected to database');app.listen(3000);})
.catch((err)=>{console.log(err)});
app.set('view engine' , 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended :true}))
app.use(express.json())

// login page
app.get('/' , (req,res) =>{
        res.render('login' ,{title : 'login', display : 0});
    
})

// failed login page
app.get('/fail' , (req,res) =>{
    res.render('login' ,{title : 'login', display : 1});
})


// get appropriate user for login
app.post('/login' , (req,res) =>{
    console.log(req.body);
    LoginData.findOneAndUpdate({username : req.body.username, password : req.body.password} , {status : true})
    .then(result =>{
        // console.log(result);
        if(result){
            console.log(result);
        if(result.designation == 'A'){
            res.redirect(`/A/${result._id}`);
        }
            
        else if(result.designation == 'F'){
            res.redirect(`/F/${result._id}`);
        }
            
        else{
            res.redirect(`/S/${result._id}`);
        }
            
    }else{
        res.redirect('/fail');
    }})
    .catch(err =>{console.log(err)})
})


app.get('/A/:id/logout' , (req,res) =>{
    // console.log(req.body);
    const id = req.params.id;
    LoginData.findByIdAndUpdate( id , {status : false})
    .then(result =>{console.log(result);res.redirect('/')})
    .catch(err =>{console.log(err)})
})


app.get('/404' , (req,res)=>{
    res.render('404', {title : 'Page not found'})
})


// app.use(loginVerification);
// Admin first page
app.get('/A/:id', loginVerification, (req,res) =>{
    const id = req.params.id;
    LoginData.find()
    .then((result) =>{res.render('A_adduser' , {title : "add user",display :0,id, users : result});})
    .catch((err) =>{console.log(err)})
    
});


app.get('/A/:id/delUser',loginVerification, (req,res) =>{
    const id = req.params.id;
    LoginData.find()
    .then((result) =>{res.render('A_adduser' , {title : "add user",display :1,id , users : result});})
    .catch((err) =>{console.log(err)})
});

app.get('/A/:id/resUser',loginVerification, (req,res) =>{
    const id = req.params.id;
    LoginData.find()
    .then((result) =>{res.render('A_adduser' , {title : "add user",display :2,id , users : result});})
    .catch((err) =>{console.log(err)})
});


app.post('/A/:id/newuser',loginVerification, (req,res) =>{
    const id = req.params.id;
    req.body.status = false;
    const loginData = new LoginData(req.body);
    loginData.save()
    .then(result =>{res.redirect(`/A/${id}`);})
    .catch(err =>{console.log(err)});
});

app.post('/A/:id/deleteUser',loginVerification,  (req,res) =>{
    const id = req.params.id;
    LoginData.findOneAndDelete({username : req.body.username})
    .then(result =>{res.redirect(`/A/${id}/delUser`);})
    .catch(err =>{console.log(err)});
});

app.post('/A/:id/resetUser', loginVerification, (req,res) =>{
    const id = req.params.id;
    
    LoginData.findOneAndUpdate({username : req.body.username} , {password : req.body.username})
    .then(result =>{res.redirect(`/A/${id}/delUser`);})
    .catch(err =>{console.log(err)});
});


app.get('/A/:id/course',loginVerification, (req,res)=>{
    const id = req.params.id;
    LoginData.find({designation : 'F'})
    .then(result =>{
            res.render('A_course', {title : 'course edit' , id ,cid : 0 ,display : 0, faculties : result });
    })
    .catch(err =>{console.log(err)})
    
})

app.post('/A/:id/newCourse',loginVerification, (req,res)=>{
    const id = req.params.id;
    // req.body.f1 = req.body.f1.replace("_" , "");
    req.body.f1 = JSON.parse(req.body.f1);
    req.body.f2 = JSON.parse(req.body.f2);
    req.body.f3 = JSON.parse(req.body.f3);
    // console.log(typeof(req.body.f1));

    // JSON.parse(req.body.f2);
    // JSON.parse(req.body.f3);
    const courseData = new CourseData(req.body);
    courseData.save()
    .then(result =>{
        // console.log(result);
        res.redirect(`/A/${id}/course`);
    }) 
    .catch(err =>{console.log(err)});
})

app.get('/A/:id/deleteCourse',loginVerification, (req,res)=>{
    const id = req.params.id;
    CourseData.find()
    .then(courses =>{
        res.render('A_course', {title : 'course delete' , id ,display : 2, courses});
        })
        .catch(err =>{console.log(err)})
})

app.post('/A/:id/deleteCourse',loginVerification, (req,res)=>{
    CourseData.findOneAndDelete(req.body)
    .then(courses =>{
        res.redirect(req.url);
        })
        .catch(err =>{console.log(err)})
})


app.post('/A/:id/:cid',loginVerification, (req,res)=>{
    const id = req.params.id;
    const cid = req.params.cid;
    req.body.f1 = JSON.parse(req.body.f1);
    req.body.f2 = JSON.parse(req.body.f2);
    req.body.f3 = JSON.parse(req.body.f3);

    for(let i = 0;i<req.body.students.length;i++){
        req.body.students[i] = JSON.parse(req.body.students[i]);
    }

    // console.log(req.body);
    CourseData.findOneAndUpdate({cid : cid} , req.body)
    .then(result =>{res.json({redirect :`/A/${id}/${cid}`})})
    .catch(err =>{console.log(err)})
    // console.log(req.body);
    
})
app.get('/A/:id/0',loginVerification, (req,res)=>{
    const id = req.params.id;
    const cid = req.params.cid;
    // console.log(req.params);
    CourseData.find()
    .then(courses =>{
        res.render('A_course', {title : 'course edit' , id ,cid : 0 ,display : 1, courses});
        })
        .catch(err =>{console.log(err)})
})

app.get('/A/:id/:cid',loginVerification, (req,res)=>{
    const id = req.params.id;
    const cid = req.params.cid;
    // console.log("y");
    LoginData.find({designation : 'F'})
    .then(faculties =>{
        CourseData.findOne({cid : `${cid}`})
        .then((course) =>{
            // console.log(studentsInCourse);
            CourseData.find()
            .then((courses)=>{
                // console.log("course");
            let students = [];
                course.students.forEach((e) =>{
                    students.push(e.username);
                })
                // console.log(students);
                LoginData.find({designation : "S" , username : {$nin : students}})
                .then(studentsNotInCourse =>{
                    // console.log(studentsNotInCourse);
                    console.log(course);
                    res.render('A_course', {title : 'course edit' , id ,cid ,display : 1, courses,course, faculties , studentsNotInCourse});
                })
                .catch(err =>{console.log(err)})
            // console.log(courseData);
            
            })
            .catch((err) =>{console.log(err)})
        // res.json({faculties,courseData});
        // console.log("y");
        
                
        })
        .catch(err=>{console.log(err)});
            
    })
    .catch(err =>{console.log(err)})
    
})






app.get('/find' , (req,res)=>{
    // const loginData = new LoginData({
    //     fName : "Amal",
    //     lName : "Shibu",
    //     username : "A1",
    //     password : "1234",
    //     designation : 'A'
    // })

    // loginData.save()
    // .then(result =>{res.send(result)})
    // .catch(err =>{console.log(err)})
    // LoginData.find({designation : 'F'})
    // .then(result => LoginData.findByIdAndDelete(result[0]._id))
    // .then(result =>{res.send("y")})
    // .catch(err=>{console.log(err)})
        CourseData.find()
        .then(result =>{
        res.send(result);})
        .catch(err=>{console.log(err)})

})


function loginVerification(req,res,next){
    const id = req.params.id;
    // console.log(req.params);

        // console.log(req.body);
        LoginData.findById(id)
        .then(result =>{
            // console.log(result);
            if(!result.status){
                res.redirect('/404');
            }else
                next();
                
        })
        .catch(err =>{console.log(err)})
}