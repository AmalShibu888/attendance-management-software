const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const CourseData = require('./models/course_data.js')
const Attendance = require('./models/Attendance.js')

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


app.get('/user/:id/logout' , (req,res) =>{
    console.log(req.body);
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

app.get('/F/:id',(req,res)=>{
    
    const id = req.params.id;
    LoginData.findById(id)
    .then(Faculty =>{
        // console.log('y');
        CourseData.find({$or: [{"f1.username" : Faculty.username} , {"f2.username" : Faculty.username},{"f3.username" : Faculty.username}]})
        .then(courses =>{
            res.render('F_attR', {title : "Mark Attendance" ,id,courses,display : 0});
        })
        .catch(err =>{console.log(err)});
    })
    .catch(err =>{console.log(err)});
})


const attDataGen = (students ,studentAttendance )=>{
    let i = 0;
    let slot = 1;
    let dates = [];
    let courseAtt = [];
    // console.log(studentAttendance);
    while(i<studentAttendance.length){
        dates.push(studentAttendance[i]);
        let temp = [];
        for(let j= 0;j<students.length;j++){
            let sid = students[j].username;
            let obj = {};
            obj.sid = sid;
            obj.slot = slot;
            // console.log(i , sid ,studentAttendance[i].sid );
            if(i<studentAttendance.length && sid == studentAttendance[i].sid){
                obj.newstat = "0";
              obj.att =   studentAttendance[i].attendance;
              i++;
            }else{
                obj.newstat = "1";
                obj.att =  false;
            }
            temp.push(obj);
        }
        courseAtt.push(temp);
        slot++;
    }
    
    let res = {};
    res.courseAtt = courseAtt;
    // console.log(courseAtt);
    res.n = students.length;
    res.dates = dates;
    return res;
}
app.get('/F/:id/:cid',(req,res)=>{
    const id = req.params.id;
    const cid = req.params.cid;
    CourseData.findOne({cid:cid})
    .then(course =>{
        Attendance.find({ cid : cid}).sort({slot : 1,sid : 1})
        .then(studentAttendance =>{
            let sortedstudents = [...course.students];
            sortedstudents = sortedstudents.sort((a,b)=>{
                if(a.username < b.username)
                    return -1;
                else
                    return 1; 
            });
            // console.log(sortedstudents);
        const courseAttendance = attDataGen(sortedstudents ,studentAttendance );
        course.students = sortedstudents;
        // courseAttendance.push(studentAttendance);
                    // console.log(courseAttendance);
                    // console.log(courseAttendance.courseAtt);
        res.render('F_attR', {title : "Mark Attendance" ,id,cid ,courseAttendance : courseAttendance.courseAtt ,course ,n :courseAttendance.n,dates : courseAttendance.dates ,display : 1});


        })
        .catch(err=>{console.log(err)})
            // return Promise.all(courseAttendance);
    })

    .catch(err=>{console.log(err)})
    // })/
})

app.post('/F/:id/:cid',async (req,res)=>{
    const id = req.params.id;
    const cid = req.params.cid;
    const data = req.body;
    console.log(data.attchanges);
    let newSlotAtt= [];
    
    if(data.newstatus == 0){
        // console.log("data.studentsList");
        data.studentsList.forEach(studentId =>{
            let newobj = JSON.parse(JSON.stringify((data.date)));
            newobj.sid = studentId;
            newobj.cid = cid;
            newobj.attendance = true;
            newSlotAtt.push(newobj);
            // console.log(data.date);
        });
        // console.log(newSlotAtt);
        Attendance.insertMany(newSlotAtt)
        .then(async result =>{
            console.log("Y",data.newstudent);
            Attendance.insertMany(data.newstudent)
            .then(async resu =>{
                for(const change of data.attchanges){
               
                    const result = await Attendance.findOneAndUpdate({cid : cid , sid : change.sid , slot : change.slot} , {attendance : change.attendance});
                }
                res.json({redirect : `/F/${id}/${cid}`}) 
            })
            .catch(err =>{console.log(err)})
            
        })
        .catch(err =>{console.log(err)})
    }else{
        
        Attendance.insertMany(data.newstudent)
        .then(async resu =>{
            console.log(data.newstudent);
            for(const change of data.attchanges){
           
                const result = await Attendance.findOneAndUpdate({cid : cid , sid : change.sid , slot : change.slot} , {attendance : change.attendance});
            }
            res.json({redirect : `/F/${id}/${cid}`}) 
        })
        .catch(err =>{console.log(err)}) 
    }
    
    // })/
})


function getCoursesFromAttendance(att){
    let res = [];
    let n = att.length, i = 0;
    while(i<n){
        res.push(att[i].cid);
        let s = att[i].cid;
        while(i<n && att[i].cid == s)
            i++;
    }
    return res;

}
app.get('/S/:id' ,async (req,res)=>{
    const id = req.params.id;
    const student = await LoginData.findById(id);
    let courses =  await Attendance.find({sid : student.username}).sort({cid : 1,slot : 1});
    courses = getCoursesFromAttendance(courses);
    let Courses = []
    for(const course of courses){
        const cd = await CourseData.findOne({cid : course})
        Courses.push(cd);
    }


    res.render('S_attView', {title : "View Attendance" ,id ,courses : Courses,display : 0});
})

function getDateFromAtt(att){
    let res = [] , i = 0;
    while(i<att.length){
        const at = att[i];
        let s = ""
        if(at.date <10)
            s +=`0${at.day}/`
        else
            s +=`${at.day}/`
        
        if(at.month <10)
            s +=`0${at.month}/${at.year}`
        else
            s +=`${at.month}/${at.year}`
        
        let obj = {}
        obj.date = s;
        s = "";
        if(at.hour <10)
            s +=`0${at.hour}:`
        else
            s +=`${at.hour}:`;
        
        if(at.minute <10)
            s +=`0${at.minute}`
        else
            s +=`${at.minute}`
        obj.time = s;
        res.push(obj);
        i++;
    }
    return res;
}

function getAttFromAtt(att){
    let res = [];
    for(const at of att){
        res.push(at.attendance);
    }
    return res;
}

app.get('/S/:id/:cid' ,async (req,res)=>{
    const id = req.params.id;
    const cid = req.params.cid;
    
    const student = await LoginData.findById(id);
    const StudentAtt = await Attendance.find({cid : cid , sid : student.username}).sort({slot : 1});
    // console.log(StudentAtt);

    const dates = getDateFromAtt(StudentAtt);
    const attendances = getAttFromAtt(StudentAtt);
    console.log(attendances);
    res.render('S_attView', {title : "View Attendance" ,    attendances , dates,cid ,id ,display : 1});
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