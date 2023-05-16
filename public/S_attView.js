
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
        window.location.href = `/S/${id}/${e.target.value}`;
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

