
class StudentEdit  {
   
    constructor(){
        this.courseSelector = document.getElementById('cid');
        this.id = this.courseSelector.dataset.id;
        this.cid = this.courseSelector.dataset.cid;
        this.TablesOfStudents = [];
        this.form = document.querySelector('.form-button');
        this.form = document.getElementById('courseEditForm');
        // this.RowFun;

    }

    RowFun(){
        
        this.TablesOfStudents.push(document.getElementById('studentT1').children[1].children[0]);
        this.TablesOfStudents.push(document.getElementById('studentT2').children[1].children[0]);
        this.TablesOfStudents.forEach((table) =>{
            let i = 0;
            
            var rows = table.children;
            Array.from(rows).forEach((e)=>{
                if(i != 0){
                    e.addEventListener('click' , (event)=>{
                        // console.log(e);
                        let x = parseInt(e.dataset.table)
                        x++;
                        x = x%2;
                        e.dataset.table = x; 
                        e.remove();
                        this.TablesOfStudents[x].appendChild(e);
                    })
                }
                i++;
            })
        })
    }

    getFormData(data){
        let result = {};
        result.students = [];
        // console.log(data);
        for(let i = 1;i<data.length;i++){
            result[data[i][0]] = data[i][1];
        }
        
        let i = 0;
        var rows = this.TablesOfStudents[0].children;
            // console.log()
        Array.from(rows).forEach((e)=>{
            if(i != 0){
                // console.log(e.dataset.student);
                result.students.push(e.dataset.student);
            }
            i++;
        })
        return result;
    }
}


class Front extends StudentEdit {

    
    
    loadCourseData(){
        this.courseSelector.addEventListener('change' ,(e)=> {
            window.location.href = `/A/${this.id}/${this.courseSelector.value}`;
            return this;
        })
    }


}
const form = document.getElementById('courseEditForm');

const front = new Front();
// console.log(front.courseSelector);
front.loadCourseData();
if(front.cid != 0){
    front.RowFun();
    form.addEventListener('submit' , (e)=>{
        e.preventDefault();

        // const formData  = front.getFormData();
        // console.log(formData);
        const formData = new FormData(form);
        const data = front.getFormData([...formData]);
        // console.log(data);
        // console.log(this.id , this.cid);
        fetch(`/A/${front.id}/${front.cid}`, {
            method :'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
            .then(res => res.json())
            .then(result =>{window.location.href = result.redirect})
            .catch(err =>{console.log(err)});
    })
}