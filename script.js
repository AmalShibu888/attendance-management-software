
class panelfunction {
    constructor(openbtn , closebtn, popupbox){
        this.openbtn = document.querySelector('.listicon');
        this.closebtn = document.querySelector('#popuppanel_close');
        this.popupbox = document.querySelector('.popupbox');
    }

    closePanel(){
        console.log(this.openbtn);
        this.closebtn.addEventListener('click', (e)=>{
            this.popupbox.style.transform = "translate(-100%)";
            this.popupbox.style.transition = "all 1s ease-in-out 0s";
            this.openbtn.classList.remove('listiconhide');
           })
    }

    openPanel(){
        this.openbtn.addEventListener('click', (e)=>{
            this.popupbox.style.transform = "translate(0%)";
            this.popupbox.style.transition = "all 1s ease-in-out 0s";
            this.openbtn.classList.add('listiconhide');
           })
    }

}

c1 = new panelfunction;

c1.closePanel();
c1.openPanel();