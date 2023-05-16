
const courseSelector = document.getElementById('cid');
const pageBody = document.getElementById('page-body');
const table = document.getElementById('attTable');
const icons = [`<i id = "plusIcon" class="fa-2x fa-solid fa-square-plus" style = "color : green"></i>` , `<i id = "minusIcon" class="fa-2x fa-solid fa-square-minus" style = "color : crimson"></i>`];
let newstatus = 0;
let dateObj = {};
let attchanges = [];
let studentsList = [];
let newstudent = [];
const attIcons = [`<i id = "check" class="fa-solid fa-check" style = "color :green"></i>` , `<i id = "xmark" class="fa-solid fa-xmark" style = "color : crimson"></i>` ]
const loadData = ()=>{
    
    courseSelector.addEventListener('change' , (e)=>{
        const id = courseSelector.dataset.username;
        // console.log(e.target.value);
        window.location.href = `/F/${id}/${e.target.value}`;
    })
}

const loadsymbol = ()=>{
    pageBody.innerHTML += icons[newstatus];
    newstatus++;
    newstatus = newstatus%2;
}



const makeSlot = ()=>{
    const students = table.children[0].children[0].children;
    
    const date = new Date();
    
    dateObj.day = date.getDate();
    dateObj.month = date.getMonth() + 1;
    dateObj.year = date.getFullYear();
    dateObj.hour = date.getHours();
    dateObj.minute = date.getMinutes();
    dateObj.slot = table.children[0].children.length;
    // console.log(dateObj);
    var currentDate = date.toLocaleDateString("de-DE");
    var time = `${dateObj.hour}:${dateObj.minute}`;
    var objstr = JSON.stringify(dateObj);
    var node = document.createElement("tr");
    node.setAttribute('data-obj' , `${objstr}`);
    let s = `<th><p>${currentDate}</p><p>${time}</p></th>`
    // console.log(students.length);
    for(let i = 1;i<students.length;i++){
        let studentObj = {}
        studentObj.sid = students[i].dataset.student;
        studentObj.slot = table.children[0].children.length;
        studentObj = JSON.stringify(studentObj);
        // console.log(studentObj);
        s += `<td  data-newstat = "0" data-changes = "0" data-obj =${studentObj}><i id = "check" class="fa-solid fa-check" style = "color :green"></i></td>`
 
        studentsList.push(students[i].dataset.student);
    }
    node.innerHTML = s;

    // console.log(s);
    return node;
}
const addSlot = ()=>{
    const icon = document.getElementById('plusIcon');
    icon.addEventListener('click' , (e)=>{
        e.target.remove();
        loadsymbol();
        document.getElementById('attTable').children[0].append(makeSlot());
        markAttendance();
        removeSlot();
    })
}

const removeSlot = ()=>{
    const icon = document.getElementById('minusIcon');
    icon.addEventListener('click' , (e)=>{
        e.target.remove();
        loadsymbol();
        let table = document.getElementById('attTable').children[0];
        table.removeChild(table.lastChild);
        addSlot();
    })
}

const markAttendance = ()=>{
    let rows = document.getElementById('attTable').children[0].children;
    
    for(let i = 1;i<rows.length;i++){
        let els = rows[i].children;
        for(let j = 1;j<els.length;j++){
            els[j].addEventListener('click', (e)=>{
                let node = els[j].children[0];
                // console.log(node.id);
                if(node.id == "check"){
                    els[j].innerHTML = attIcons[1];
                }else{  
                    els[j].innerHTML = attIcons[0];
                }
                
                if(els[j].dataset.newstat == "0"){
                    els[j].dataset.changes++;
                    els[j].dataset.changes = els[j].dataset.changes%2;
                    if(els[j].dataset.changes == "1"){
                        els[j].children[0].setAttribute("style", "color :   #F4B400");
                    }
                }else{
                    els[j].children[0].setAttribute("style", "color :   #F4B400");
                }
                
                // console.log(els[j])
                // console.log(els[j].dataset.obj)
                
        })
        }
    }
}

async function submitChanges(){
    let id = table.dataset.id;
    let cid = table.dataset.cid;
    getChanges();
    let data = {};
    data.date = dateObj;
    data.attchanges = attchanges;
    data.newstatus = newstatus;
    data.studentsList = studentsList;
    data.newstudent = newstudent;
    // console.log(cid);
    fetch(`/F/${id}/${cid}` , {
        method : "POST",
        headers: {
            "Content-Type": "application/json"
          },
          body : JSON.stringify(data)
    })
    .then(res => res.json())
    .then(resp =>{window.location.href = resp.redirect})
}


const getChanges = ()=>{
    const table = document.getElementById('attTable').children[0].children;
    // console.log(table);
    let i = 0,j = 0;
    Array.from(table).forEach(row =>{
        if(i > 0){
            j = 0;
            Array.from(row.children).forEach(els =>{
                // console.log(els);
                if(j > 0){
                    let att = true;
                    if(els.children[0].id != "check"){
                        att = false;
                    }
                    // console.log(els.dataset);
                    let obj = JSON.parse(els.dataset.obj)
                    obj.attendance = att;
                    if(els.dataset.newstat == "1"){
                        let cid = document.getElementById('attTable').dataset.cid;
                        let newObj = JSON.parse(els.parentNode.dataset.obj);
                        obj.day = newObj.day
                        obj.month = newObj.month;
                        obj.year = newObj.year;
                        obj.minute = newObj.minute;
                        obj.hour = newObj.hour;
                        obj.cid = cid;
                        newstudent.push(obj);
                    }
                    else if(els.dataset.changes == "1"){
                        attchanges.push(obj);
                    }
                }
                j++;
            })
        }
        i++;
    })
    // console.log(attchanges);
}


const  submitbutton = ()=>{
    const subButton = document.getElementById('subButton');
    subButton.addEventListener('click' , (e)=>{
        submitChanges();
    })
}

if(courseSelector){
    loadData();
}
else{
    loadsymbol();
    markAttendance();
    addSlot();
    submitbutton();
}

