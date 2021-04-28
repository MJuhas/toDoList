// API Request
// GET get all task of toDoList
let getToDoList = () => fetch("http://localhost:3001/")
    .then(res => res.json())
    .then(data => renderData(data))

// DELETE delete task by ID from toDoList
let deleteTask = (idOfTask) => fetch("http://localhost:3001/" + idOfTask, {
    method: 'DELETE',
})

// PUT update task by ID from toDoList
let updateTask = (idOfTask, updateData) => fetch("http://localhost:3001/" + idOfTask, {
    method: 'PUT', // Method itself
    headers: {
        'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(updateData)
}).then(getToDoList())

// POST update task by ID from toDoList
let postTask = (data) => fetch("http://localhost:3001/", {
    method: 'POST',
    headers: {
        'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(data)
}).then(getToDoList())

// Render funtion
let renderData = (data) => {
    let element = `<ul> ${data.sort((x,y) => y.id - x.id )
                        .map(item => task(item))
                        .join("")} 
                    </ul>`

    document.getElementById("toDoList").innerHTML = element
}

let task = (item) => {
    return `<li  id =${item.id}>   
                <input  type="checkbox"  ${item.completed && "checked"} >   
                <p> ${item.title} </p>
                <button class="buttonStyle"> Delete </button>
             </li>`
}

// Event listener
// handler for delete task - DELETE Request
document.getElementById("toDoList").addEventListener("click", async function(e) {

    if (e.target && e.target.nodeName == "BUTTON") {
        let idOfTask = e.path[1].id
        await deleteTask(idOfTask)
        document.getElementById(idOfTask).remove() // only for effect
        await getToDoList()
    }
});

// handler for notice completing task - UPDATE Request
document.getElementById("toDoList").addEventListener("click", function(e) {
    if (e.target && e.target.nodeName == "INPUT") {
        let idOfTask = e.path[1].id
        let updateData = {
            "title": e.path[1].childNodes[3].childNodes[0].data,
            "completed": e.path[0].checked
        }
        updateTask(idOfTask, updateData)

    }
});

// handler for post task - POST Request
document.getElementById("myInput").addEventListener("keyup", function(e) {
    data = {
        "title": document.getElementById("myInput").value,
        "completed": false
    }
    if (e.code == "Enter" && data.title !== "") {
        document.getElementById("myInput").value = ""
        postTask(data)
        getToDoList()
    }
});

getToDoList() // GET Request of all task from toDoList to first render of webside