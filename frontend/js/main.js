window.addEventListener("load",()=>{
    //variables elementos del DOM
    const formTask = document.querySelector(".layout_form");
    const inputTask = document.querySelector("#input_task");
    const inputDate = document.querySelector("#input_date");
    const tasksContainer = document.querySelector(".layout_tasks");

    //variables para almacenar las tareas
    let tasks = [];
    let id = 0;

    //Guardar tarea
    formTask.addEventListener("submit",(e)=>{
        e.preventDefault(); 
        saveTask();        
        });
})

function saveTask(){
    if(inputTask.value.trim() !== " inputDate.values.trim() !== "){
        let newTask = {
            id: ++ id,
        }

    }
}