
// function to generate unique id
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// setting the minimum date 
const today= new Date().toISOString().split("T")[0];
myDate.min=today;


// function to set minimum time if the input time has passed
function setMinTime() {
    const selectedDate = new Date(document.getElementById('myDate').value);
    const selectedTime = document.getElementById('myTime').value;

    const today = new Date();
    const isFutureDate = selectedDate > today;

    const timeInput = document.getElementById('myTime');

    if (isFutureDate) {
        timeInput.min = "";
    } else {
        const currHours = today.getHours().toString().padStart(2, "0");
        const currMinutes = today.getMinutes().toString().padStart(2, "0");
        const currTime = `${currHours}:${currMinutes}`;
        timeInput.min = currTime;
    } 
    }

 // making sure that the text input length doesn't exceed 50
 const maxLength=60;
 const inputLength=document.getElementById("text-info");
 inputLength.addEventListener("input",function(){
     if(inputLength.value.length>maxLength)
     inputLength.value=inputLength.value.slice(0,maxLength);
 });

// an empty object for storing the data  in the form
let formData={};

// an array for storing all formData
    let formDataArray=[];

// array for storing reminderId
    let reminderId;
    let reminderIdArr = []; 

// function to store reminderId values in local storage
function saveReminderIdArray(rem) {
    reminderIdArr.push(...rem);
    localStorage.setItem('ReminderIdArray', JSON.stringify(reminderIdArr));
}

// Function to retrieve ReminderIdArray from local storage
function getReminderIdArray() {
   return JSON.parse(localStorage.getItem('ReminderIdArray')) || [];
}
// function to store the form data in local storage
function saveFormData(formData){
    // push the object into the array
    const uniqueData={...formData};
    formDataArray.push(uniqueData);

// Save formDataArray to local storage after parsing it is string
   localStorage.setItem('formDataArray', JSON.stringify(formDataArray));
}

// function to load saved form data
 function loadFormData(){
    let formDataString=localStorage.getItem('formDataArray');

    // parse the json string into an object
    return JSON.parse(formDataString)||[];
 }


//  function to find and store the data in the empty object
function getData(){
   
    const inputs=document.querySelectorAll('.data');
    
    inputs.forEach(inputValue => {
        formData[inputValue.name]=inputValue.value;
    });
    reminderId=generateUniqueId();
    let rem=[];
    rem.push(reminderId.toString());
    formData['reminder']=reminderId;
   
    saveReminderIdArray(rem);
    saveFormData(formData);

    // after submition we reset the values of the form to default
    document.getElementById("myForm").reset();
}

// global count variable
let count=0;

// helper function to increase task count
 function increaseCount(){
    count++;
    const task=document.querySelector('.tracker');
     task.innerHTML= `${count} tasks to be completed`;
}

// helper function to decrease task count
    function decreaseCount(){
        if(count===3)
        document.querySelector('#maxLimit').remove();
    
        if(count>0){
        count--;
        const task=document.querySelector('.tracker');
        task.innerHTML= `${count} tasks to be completed`;
        
        }
    }

// function to make the hero div bigger on each submit and create smaller
// div inside the bigger div
    function increaseDiv(){
        const hero=document.querySelector('.hero');
        const add=document.createElement('div');
        const div=document.createElement('div');
        // Generate a unique identifier for the reminder
      

        // Assign the reminderId to the div as a data attribute
        div.setAttribute('data-reminder-id', reminderId);
        div.setAttribute('class','newDiv');
        add.appendChild(div);
        add.setAttribute('class','increaseDiv');
        document.body.appendChild(add);

        addData(formData,div,add,reminderId);
    }
// reload local storage data on each load
    window.addEventListener('load', function() {
        document.getElementById("myForm").reset()
        formDataArray = loadFormData();
        reminderIdArr=getReminderIdArray();
        count=0;
            formDataArray.forEach((formDatas,index) => {
                const add = document.createElement('div');
                const div = document.createElement('div');
                div.setAttribute('class', 'newDiv');
                div.setAttribute('data-reminder-id', reminderIdArr[index]);
                add.appendChild(div);
                add.setAttribute('class', 'increaseDiv');
                document.body.appendChild(add);
                count++;
                addData(formDatas, div, add);
                document.getElementById("myForm").reset()
            });
          
        const task=document.querySelector('.tracker');
        task.innerHTML= `${count} tasks to be completed`;
    });

// function to add info inside the smaller div
    function addData(formData,div,add,reminderId){
        if(formData.Priority==="Emergency"){
        div.innerHTML="<p class='dated'>"+formData.Date+"</p>"+"<p class='timed'>"+formData.Time+"</p>"
        +"<p class='information'>"+formData.info+"</p>" +"<p class='priorityList' style='color:red'>"+formData.Priority+"</p>";
        }
        else{
            div.innerHTML="<p class='dated'>"+formData.Date+"</p>"+"<p class='timed'>"+formData.Time+"</p>"
            +"<p class='information'>"+formData.info+"</p>" +"<p class='priorityList'>"+formData.Priority+"</p>";
        }
       
        document.querySelector('.priorityList').setAttribute('class','redEm');
        
        addEditButton(div,add,reminderId);
        addDeleteButton(div,add,reminderId);
    }


// function to create a reminder
function makeReminder(event){
    // prevents the page from refreshing while submitting
    event.preventDefault();
    if(count<10){
   
    getData();
    increaseDiv();   
    increaseCount();
    
    }
    else{
        limitReached();
    }
}

// helper function to create message when task limit is reached 
function limitReached(){
    const limit=document.createElement('p');
    limit.innerHTML="The Task limit has been reached";
    limit.setAttribute('class','tracker');
    limit.setAttribute('id','maxLimit')
    document.body.appendChild(limit);
}

// helper function to add edit button in new div
function addEditButton(div,add){
    const editbutton=document.createElement('img');
    editbutton.src='edit.png';
    editbutton.alt="Edit Button";
    editbutton.setAttribute('class','divEditButton');
   
    div.appendChild(editbutton);
    editReminder();
}
// function to edit the reminder
function editReminder(){
    const editButtonFinder=document.querySelectorAll('.divEditButton');
    editButtonFinder.forEach((button)=>{
        button.addEventListener('click',(event)=>{
        // select all the info of the div
            const div=button.parentNode;
            const editDate=div.querySelector('.dated').innerText;
            const editTime=div.querySelector('.timed').innerText;
            const editInfo=div.querySelector('.information').innerText;
            const editPri=div.querySelector('.priorityList').innerText;

        // now repopulate the input forms  with the info
            document.querySelector('#myDate').value=editDate;
            document.querySelector('#myTime').value=editTime;
            document.querySelector('#text-info').value=editInfo;
            document.querySelector('#myPrior').value=editPri;
            
        // now delete the old div from memory
            // Get the parent div and grandParent div of the clicked button
            let parentDiv = button.parentNode;
            let  grandParentDiv=parentDiv.parentNode;
    
            // Remove the parent div and grandparent div
            parentDiv.parentNode.removeChild(parentDiv);
            grandParentDiv.parentNode.removeChild(grandParentDiv);
            let rem = parentDiv.getAttribute('data-reminder-id');

            // removing data from reminderIdArray
            reminderIdArr=reminderIdArr.filter(reminder=> reminder!==rem);
            localStorage.setItem('ReminderIdArray', JSON.stringify(reminderIdArr));

            // removing data from formDataArray in local storage 
           
            const filteredArray=formDataArray.filter(obj=> obj.reminder!==rem);

            formDataArray.length=0;
            formDataArray.push(...filteredArray);
            localStorage.setItem('formDataArray', JSON.stringify(formDataArray));

    // decrease the count on delete
        decreaseCount();
        });
    });
}

//  function to add delete button and it's functionalities in the new div
function addDeleteButton(div,add){
    const deletebutton=document.createElement('img');
    deletebutton.src='delete.png';
    deletebutton.alt="Delete Button";
    deletebutton.setAttribute('class','divDeleteButton');
    div.appendChild(deletebutton);

    // delete the divs on click
    deleteReminder();
};

// function to delete a reminder and decrease count
function deleteReminder(){
    const delButtons=document.querySelectorAll('.divDeleteButton')
    delButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            // Get the parent div and grandParent div of the clicked button
            let parentDiv = button.parentNode;
            let  grandParentDiv=parentDiv.parentNode;
    
            // Remove the parent div and grandparent div
            parentDiv.parentNode.removeChild(parentDiv);
            grandParentDiv.parentNode.removeChild(grandParentDiv);
            let rem = parentDiv.getAttribute('data-reminder-id');

            // removing data from reminderIdArray
            reminderIdArr=reminderIdArr.filter(reminder=> reminder!==rem);
            localStorage.setItem('ReminderIdArray', JSON.stringify(reminderIdArr));

            // removing data from formDataArray in local storage 
           
            const filteredArray=formDataArray.filter(obj=> obj.reminder!==rem);

            formDataArray.length=0;
            formDataArray.push(...filteredArray);
            localStorage.setItem('formDataArray', JSON.stringify(formDataArray));

    // decrease the count on delete
        decreaseCount();
    });
    });
}

// function to delete reminder when the given time is exceeded
    function deleteOnTime(){
    let parentDivs = document.querySelectorAll('.newDiv');
    let now = new Date();

    parentDivs.forEach(function (parentDiv) {
        const dateStr = parentDiv.querySelector(".dated").textContent;
        const timeStr = parentDiv.querySelector(".timed").textContent;
        const givendate = new Date(dateStr);
        const giventime = timeStr.split(":");
        givendate.setHours(giventime[0]);
        givendate.setMinutes(giventime[1]);

        if (now > givendate) {
            let grandparent=parentDiv.parentNode;
            parentDiv.remove();
            grandparent.remove();
           decreaseCount();
        }
    });
        }

        setInterval(deleteOnTime,1000);


       
    


