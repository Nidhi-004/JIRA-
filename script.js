let addBtn=document.querySelector(".add-btn");
let removeBtn=document.querySelector(".remove-btn")
let modalCont=document.querySelector(".modal-cont");
let taskAreaCont=document.querySelector(".textarea-cont");
let mainCont=document.querySelector(".main-cont");
let allPriorityColors=document.querySelectorAll(".priority-color");
let toolBoxColors=document.querySelectorAll(".color");
let addModal=true;
let removeFlag=false;
let colors=['red','blue','green','orange']
let modalPriortyColor=colors[colors.length-1];
var uid = new ShortUniqueId();

let ticketArr=[];

if(localStorage.getItem("tickets")){
    let str = localStorage.getItem("tickets");
    let arr = JSON.parse(str);
    ticketArr = arr;
    for(let i=0;i<arr.length;i++){
        let ticketObj = arr[i];
        createTicket(ticketObj.color,ticketObj.task,ticketObj.id);
    }
}

for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click", function(){
        let currentColor = toolBoxColors[i].classList[1];
        let filteredArr = [];
        for (let i = 0; i < ticketArr.length; i++) {
            if (ticketArr[i].color == currentColor) {
                filteredArr.push(ticketArr[i]);
            }
        }

        let allTickets = document.querySelectorAll(".ticket-cont");
        for (let j = 0; j < allTickets.length; j++) {
            allTickets[j].remove();
        }
        for (let i = 0; i < filteredArr.length; i++) {
            let ticket = filteredArr[i];
            let color = ticket.color;
            let task = ticket.task;
            let id = ticket.id;
            createTicket(color, task, id)
        }
    })
    toolBoxColors[i].addEventListener("dblclick",function(){
        let allTickets = document.querySelectorAll(".ticket-cont");
        for (let j = 0; j < allTickets.length; j++) {
            allTickets[j].remove();
        }
        for (let i = 0; i < ticketArr.length; i++) {
            let ticket = ticketArr[i];
            let color = ticket.color;
            let task = ticket.task;
            let id = ticket.id;
            createTicket(color, task, id)
        }
    })
}


addBtn.addEventListener("click",function(){
    
    if(addModal){
        modalCont.style.display="flex";
    }
    else{
        modalCont.style.display="none";
    }
    addModal = !addModal;

})
removeBtn.addEventListener("click",function(){
    if(removeFlag){
        removeBtn.style.color="black";
    }
    else{
        removeBtn.style.color="red";
    }
    removeFlag=!removeFlag;
})
for(let i=0;i<allPriorityColors.length;i++){
    let priorityDivOneColor=allPriorityColors[i];
    priorityDivOneColor.addEventListener("click",function(e){
        for(let j=0;j<allPriorityColors.length;j++){
            allPriorityColors[j].classList.remove("active");
        }
        priorityDivOneColor.classList.add("active");
        modalPriortyColor=priorityDivOneColor.classList[0];
    })

}

modalCont.addEventListener("keydown",function(e){
    let key=e.key;
    if(key=="Enter"){
        // console.log(taskAreaCont.value);
        createTicket(modalPriortyColor,taskAreaCont.value);
        taskAreaCont.value="";
        modalCont.style.display="none";
        addModal=!addModal;

    }
})

function createTicket(ticketColor,task,ticketId){
    let id;
    if (ticketId == undefined) {
        id = uid();
    } else {
        id = ticketId;
    }

    // <div class="ticket-cont">
    //         <div class="ticket-color green"></div>
    //         <div class="ticket-id">#qw234e</div>
    //         <div class="taskarea">Welcome</div>
    // </div>
    
    let ticketCont=document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML=`<div class="ticket-color ${ticketColor}"></div>
                          <div class="ticket-id">#${id}</div>
                          <div class="taskarea">${task}</div>
                          <div class="lock-unlock"><i class="fa fa-lock"></i></div>`

    mainCont.appendChild(ticketCont);

    //lock unlock handle

    //update UI
    let ticketTaskArea=ticketCont.querySelector(".taskarea");
    let lockUnlockBtn=ticketCont.querySelector(".lock-unlock i");
    lockUnlockBtn.addEventListener("click",function(){
        if(lockUnlockBtn.classList.contains("fa-lock")){
            lockUnlockBtn.classList.remove("fa-lock");
            lockUnlockBtn.classList.add("fa-unlock");
            ticketTaskArea.setAttribute("contenteditable","true")
        }
        else{
            lockUnlockBtn.classList.remove("fa-unlock");
            lockUnlockBtn.classList.add("fa-lock");
            ticketTaskArea.setAttribute("contenteditable","false")
        }
        //update ticketArr
        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].task=ticketTaskArea.textContent;
        updateLocalStorage();
    })

    

    //handle delete
    ticketCont.addEventListener("click",function(){
        if(removeFlag){
            //delete from UI
            ticketCont.remove();
            //delete from ticketArr
            let ticketIdx=getTicketIdx(id);
            ticketArr.splice(ticketIdx,1);//remove a ticket
            updateLocalStorage();
        }   
    })
    //handle color
    let ticketColorBand=ticketCont.querySelector(".ticket-color");
    ticketColorBand.addEventListener("click",function(){
        //update UI
        let currentTicketColor=ticketColorBand.classList[1];
        let currentTicketColorIdx=-1;
        for(let i=0;i<colors.length;i++){
            if(currentTicketColor==colors[i]){
                currentTicketColorIdx=i;
                break;
            }
        }
        let nextColorIdx=(currentTicketColorIdx+1)%colors.length;
        let nextColor=colors[nextColorIdx];
        ticketColorBand.classList.remove(currentTicketColor);
        ticketColorBand.classList.add(nextColor);

        //update ticketArr as well
        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].color=nextColor;
        updateLocalStorage();
    })
    if(ticketId == undefined){
        ticketArr.push({ "color": ticketColor, "task": task, "id": id })
        updateLocalStorage();
    }
}
    
function getTicketIdx(id){
    for(let i=0;i<ticketArr.length;i++){
        if(ticketArr[i].id==id){
            return i;
        }
    }
}
function updateLocalStorage(){
    let stringifyArr = JSON.stringify(ticketArr);
    localStorage.setItem("tickets",stringifyArr);
}
