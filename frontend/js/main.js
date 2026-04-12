window.addEventListener("load", () => {
    //variables elementos del DOM
    const formTask = document.querySelector(".layout_form");
    const inputTask = document.querySelector("#input_task");
    const inputDate = document.querySelector("#input_date");
    const tasksContainer = document.querySelector(".layout_task");
    const today = new Date().toISOString().split("T")[0];
    inputDate.min = today;





    //variables para almacenar las tareas
    let tasks = [];
    let id = 0;

    if (localStorage.getItem("tasks-pending")) {
        tasks = JSON.parse(localStorage.getItem("tasks-pending"));
        id = tasks[tasks.length - 1].id;
        showTasks();

    }
    //Guardar tarea
    formTask.addEventListener("submit", (e) => {
        e.preventDefault();
        saveTask();
        showTasks();
    });

    function saveTask() {
        if (inputTask.value.trim() !== "" && inputDate.value.trim() !== "") {
            let newTask = {
                id: ++id,
                body: inputTask.value,
                date: inputDate.value
            };
            tasks.push(newTask);
            localStorage.setItem("tasks-pending", JSON.stringify(tasks));
            inputDate.value = "";
            inputTask.value = "";
        }
    }

    async function showTasks() {

        tasksContainer.innerHTML = "";
        tasks.forEach((task) => {
            let text = "Venció hace";
            let days = daysPending(task.date);
            let textDays = `<span class="days_text">días</span>`;
            let classDays = "";
            let numDaysTag = "";
            let numDays = Math.abs(days);


            if (days <= 0) {
                classDays = "style='color:#FF3F3F'";
                if (days == 0) {
                    text = `<span style="color: white; background-color: #FF3F3F; padding: 5px; border-radius: 5px;">La tarea se vence hoy</span>`;
                    textDays = "";
                    numDays = "";
                }

            } else {
                text = "La tarea vence en";
            }

            numDaysTag = `<p class="days_number" ${classDays}>${numDays}</p>`
            tasksContainer.innerHTML += `<article class="tasks_item">
                <div class="task_days">
                    <span class="days_text">${text}</span>
                    ${numDaysTag}
                    ${textDays}
                </div>

                <p class="tasks_body">${task.body}</p>
                <p class="tasks_date">${task.date}</p>

                <div class="task_buttons"> 
                    <button class="tasks_btn-help" data-task="${task.body}">
                        ¿Cómo hacerlo?
                    </button>

                    <button class="tasks_btn-delete" data-id="${task.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                <p class="tasks_exp">Hola que tal como estas</p>
            </article>`;
        });

        //borrado de tareas
        deleteTask()
        //Como hacer tarea
        howToDo();


    }

    function daysPending(userDate) {
        let maxDate = new Date(userDate);
        let today = new Date();
        let difference = maxDate.getTime() - today.getTime();

        let result = Math.ceil(difference / (1000 * 3600 * 24));
        return result;


    }

    function deleteTask() {
        document.querySelectorAll(".tasks_btn-delete").forEach((btnDelete) => {
            btnDelete.addEventListener("click", () => {

                Swal.fire({
                    title: "¿Está seguro?",
                    text: "¡No podrás revertir esto!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#4D9657",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si"
                }).then((result) => {

                    if (result.isConfirmed) {
                        const taskId = parseInt(btnDelete.getAttribute("data-id"));
                        const index = tasks.findIndex(task => task.id === taskId);
                        if (index !== -1) {
                            tasks.splice(index, 1);
                            localStorage.setItem("tasks-pending", JSON.stringify(tasks));
                            showTasks();

                            Swal.fire({
                                title: "¡Eliminado!",
                                text: "Tu tarea ha sido eliminada",
                                icon: "success"

                            });
                        }
                    }
                });


            });

        });

    }

    async function howToDo() {
        document.querySelectorAll(".tasks_btn-help").forEach((btnHelp) => {
            btnHelp.addEventListener("click", async () => {
                const expElement = btnHelp.closest(".tasks_item").querySelector(".tasks_exp");
                expElement.textContent = "";
                expElement.style.display = "block";
                expElement.textContent = "Generando explicación...";

                try {
                    loader(true);
                    const response = await fetch("http://localhost:3000/how-to", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ task: btnHelp.getAttribute("data-task") })
                    });

                    const data = await response.json();
                    expElement.textContent = data.text;
                    loader(false);

                } catch (error) {
                    expElement.textContent = "Error al generar la explicación";
                    expElement.style.display = "block";
                    console.error("Error al generar la explicación:", error);
                    loader(false);
                }

            })

        });


    }


})

function loader(state) {
    
    if (state) {
        JsLoadingOverlay.show({
            'spinnerIcon': 'ball-atom',
            'overlayOpacity': 0.6,
            "spinnerColor": "#4D9657",
        });

    } else {
        JsLoadingOverlay.hide();

    }

}