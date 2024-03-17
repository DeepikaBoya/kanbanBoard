const addref = document.querySelector(".action-wrapper .add");
const deleteref = document.querySelector(".action-wrapper .Delete");
const modalref = document.querySelector(".modal");
const textref = document.querySelector("textarea");
const taskwrapperref = document.querySelector(".tasks-wrapper");
const rightcategoryselectionref = document.querySelectorAll(
    ".right-section .category"
);
const  headerCategoryFilterWrapper=document.querySelector('header .category-wrapper')
// const deleteiconref = document.querySelector(".tasks .task-delete-icon");
const taskSearchRef=document.querySelector('.task-search input')
addref.addEventListener("click", function (e) {
    togglemodal();
});

function defaultCategoryselection() {
    removeAllCategorySelection();
    const firstcategory = document.querySelector(".right-section .category.p1");
    firstcategory.classList.add("selected");
}
function togglemodal() {
    const ishidden = modalref.classList.contains("hide");
    if (ishidden) {
        modalref.classList.remove("hide");
    } else {
        defaultCategoryselection();
        modalref.classList.add("hide");
    }
}
// const tasks = [];
const tasks = JSON.parse(localStorage.getItem("tasks") || '[]');
function renderTaskList() {
    // to render the data from localstorage when we reload or close tab
    tasks.forEach((task) => {
        createtasks(task);
    });
}
renderTaskList();
function addTasksInData(newtask) {
    tasks.push(newtask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
textref.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
        console.log("add task", e.target.value);
        const rightselectedcategory = document.querySelector(
            ".right-section .category.selected"
        );
        const selectedcategoryname =
            rightselectedcategory.getAttribute("data-category");

        const newtask = {
            id: Math.random(),
            title: e.target.value,
            category: selectedcategoryname,
        };
        addTasksInData(newtask);
        // tasks.push(newtask)
        // console.log(tasks);
        e.target.value = "";
        togglemodal();
        createtasks(newtask);
    }
});

//creating tasks list dynamically
function createtasks(task) {
    const taskref = document.createElement("div");
    taskref.className = "tasks";
    // taskref.setAttribute('data-id',task.id);
    taskref.dataset.id = task.id;
    taskref.innerHTML = `

    <div class="task-category" data-priority="${task.category}"></div>
    <div class="task-id">${task.id}</div>
    <div class="task-title"><textarea>${task.title}</textarea></div>
    <div class="task-delete-icon"> <i class="fa-solid fa-trash"></i></div>
    
    `;

    taskwrapperref.appendChild(taskref);
    // const deleteiconref=taskref.querySelector('.task-delete-icon .fa-trash')
    //remove tasks when we click on delete icon
    // deleteiconref.addEventListener('click',function(e)
    // {
    //     const selectedtaskdeleteicon=e.target.closest('.tasks');
    //     console.log("ok",selectedtaskdeleteicon )
    //     // selectedtaskdeleteicon.classList.add('hide'); -->it will get hided and it will be in dom
    //     selectedtaskdeleteicon.remove(); // it remove from dom also
    //     deleteTaskFromData(task.id); /// delete tasks from array or from data
    //     console.log("delete",tasks);

    // })
    const textarearef=taskref.querySelector('.task-title textarea');
    textarearef.addEventListener('change',function(e)
    {
        const updatedTitle=e.target.value;
        const currentTaskId=task.id;
        updateTitleData(updatedTitle,currentTaskId)

    })

}

//set priioty with colours

rightcategoryselectionref.forEach(function (category) {
    category.addEventListener("click", function (e) {
        removeAllCategorySelection();
        e.target.classList.add("selected");
    });
});
function removeAllCategorySelection() {
    rightcategoryselectionref.forEach((category) => {
        category.classList.remove("selected");
    });
}
function updateTitleData(updatedTitle,taskId)
{
    const selectedTaskidx = tasks.findIndex((task) => {
        Number(task.id)===Number(taskId);
    });
    //option1
    const selectedTask=tasks[selectedTaskidx];
    selectedTask.title=updatedTitle;
    localStorage.setItem('tasks',JSON.stringify(tasks));
    // //option2
    // const selectedTask={...tasks[selectedTaskidx]};
    // selectedTask.title=updatedTitle
    // const updatedTasks=[...tasks];
    // tasks.splice(selectedTaskidx, 1,selectedTask);
    // tasks=updatedTasks
}
function deleteTaskFromData(taskid) {
    const selectedTaskidx = tasks.findIndex((task) => {
        taskid == task.id;
    });
    tasks.splice(selectedTaskidx, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//remove tasks when we click on delete icon(without using event listener on every delete icon
//instead use on parent(taskwrapper) using single event listener)

taskwrapperref.addEventListener("click", function (e) {
    console.log(e.target.classList.contains("fa-trash"));
    if (e.target.classList.contains("fa-trash")) {
        const currenttaskref = e.target.closest(".tasks");

        currenttaskref.remove();
        const taskId = currenttaskref.dataset.id;
        deleteTaskFromData(taskId);
        console.log(tasks);
    }
    //changing priority colours on clicking header colour of task
    if (e.target.classList.contains('task-category')) {
        const currentpriority = e.target.dataset.priority;// e.target.getAttribute('data-priority)
        const nextpriority = getnextpriority(currentpriority);
        e.target.dataset.priority = nextpriority; //e.target.setAttribute('data-priority',nextpriority)
        const taskId = Number(e.target.closest('.tasks').dataset.id);
        updatePriorityInData(taskId, nextpriority)

    }
});

function getnextpriority(currentpriority) {
    const priorityList = ['p1', 'p2', 'p3', 'p4'];
    const currentpriorityIdx = priorityList.findIndex((p) => p === currentpriority);
    const nextpriorityIdx = (currentpriorityIdx + 1) % 4;
    return priorityList[nextpriorityIdx];
}
//localstorage update priority
function updatePriorityInData(taskId, nextpriority) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    tasks[taskIndex].category = nextpriority;
    localStorage.setItem('tasks', JSON.stringify(tasks));


}
/// filter the task on selcting priority colour in header
headerCategoryFilterWrapper.addEventListener('click',function(e)
{
    if(e.target.classList.contains('category'))
    {
        console.log("event",e.target)
        const selectedpriority=e.target.dataset.priority
        console.log("selcted",selectedpriority);

        const taskListref=document.querySelectorAll('.tasks');
        taskListref.forEach((taskRef)=>
            {
                taskRef.classList.remove('hide');
                const currenttaskPriority=taskRef.querySelector('.task-category').dataset.priority;
                if(currenttaskPriority!==selectedpriority)
                {
                    taskRef.classList.add('hide');
                }
            })
    }


})
deleteref.addEventListener('click',function(e)
{
    const isDeleteEnabled=e.target.classList.contains('enabled');
    if(isDeleteEnabled)
    {
        e.target.classList.remove('enabled');
        // toggleDeleteIcon(false);
        taskwrapperref.dataset.deleteDisabled=true// data-delete-enabled=data.deleteEnables

    }else
    {
        e.target.classList.add('enabled')
        // toggleDeleteIcon(true);
        taskwrapperref.dataset.deleteDisabled=false


    }
})
//one way to enable() 'X' and delete task
// function toggleDeleteIcon(visible)
// {
//     const alldeleteiconref = document.querySelectorAll('.task-delete-icon');
//     alldeleteiconref.forEach((deleteIconRef)=>
//     {
//         deleteIconRef.style.display=visible? "block":"none"
//     }
//     )


// }

taskSearchRef.addEventListener("keyup",function(e)
{
    console.log(e.target.value)
  //InMemory data
  
taskwrapperref.innerHTML="";
    tasks.forEach((task)=>
    {
        const currentTitle=task.title.toLowerCase();
        const searchText=e.target.value.toLowerCase();
        const taskId=String(task.id)
        if(searchText.trim()===""||currentTitle.includes(searchText) || taskId.includes(searchText))
       {
        createtasks(task)
       }

    })

    
})


    

