const Form = document.querySelector('.todo-form')
const Alert = document.querySelector('.alert')
const Todo = document.getElementById('todo-input')
const SubmitBtn = document.querySelector('.submit-btn')
const TodoContainer = document.querySelector('.todo-container')
const TodoList = document.querySelector('.todo-list')
const ClearBtn = document.querySelector('.clear-btn')

let editElement
let EditFlag = false
let EditId = ''

// Event Listeners
Form.addEventListener('submit', addItem)
ClearBtn.addEventListener('click', ClearItems)
window.addEventListener('DOMContentLoaded', setupItems)

function addItem(e){
    e.preventDefault()
    const value = Todo.value
    const id = new Date().getTime().toString()
    if (value !== '' && !EditFlag){
        const element = document.createElement('article')
        let attr = document.createAttribute('data-id')
        attr.value = id
        element.setAttributeNode(attr)
        element.classList.add('todo-item')
        element.innerHTML = `<p class="title">${value}</p>
                                <div class="btn-container">
                                    <button class="edit-btn">Edit</button>
                                    <button class="delete-btn">❌</button>
                                </div>`
        const DeleteBtn = element.querySelector('.delete-btn')
        const EditBtn = element.querySelector('.edit-btn')
        DeleteBtn.addEventListener('click', DeleteItem)
        EditBtn.addEventListener('click', EditItems)

        TodoList.appendChild(element)
        DisplayAlert('item is successfully added','success')
        TodoContainer.classList.add('show-container')
        
        addToLocalStorage(id,value)
        setBackToDefault()

    } else if (value !== '' && EditFlag){
        editElement.innerHTML = value
        DisplayAlert('value changed successfully', 'success')
        addToLocalStorage(EditId,value)
        setBackToDefault()
    } else {
        DisplayAlert('Please Enter value to change', 'danger')
    }
}

function DisplayAlert(text,action){
    Alert.textContent = text
    Alert.classList.add(`alert-${action}`)
    setTimeout(()=>{
        Alert.textContent = ''
        Alert.classList.remove(`alert-${action}`)
    },1000)
}

function ClearItems(){
    const items = document.querySelectorAll('.todo-item')
    if (items.length > 0){
        items.forEach((item)=>{
            TodoList.removeChild(item)
        })
    }
    TodoContainer.classList.remove('show-container')
    DisplayAlert('List is Empty', 'danger')

    setBackToDefault()
    localStorage.removeItem('TodoList')
}

function DeleteItem(e){
    const element = e.currentTarget.parentElement.parentElement
    const id = element.dataset.id
    TodoList.removeChild(element)
    if (TodoList.children.length === 0){
        TodoContainer.classList.remove('show-container')
    }
    DisplayAlert('! item removed !', 'danger')

    setBackToDefault()
    removeFromlocalStorage(id)
}

function EditItems(e){
    const element = e.currentTarget.parentElement.parentElement
    editElement = e.currentTarget.parentElement.previousElementSibling
    Todo.value = editElement.innerHTML
    EditFlag = true
    EditId = element.dataset.id
    SubmitBtn.textContent = '✅'
}

function setBackToDefault(){
    Todo.value = ''
    EditFlag = false
    EditId = ''
    SubmitBtn.textContent = '+'
}

/******
   Local Storage to Store the List data so we can use our app
   also in offline mode you can shutdown your browser and then
   on it again your todolist will be there.
******/
function addToLocalStorage(id, value){
    const todo = {id,value}
    let items = getLocalStorage()
    items.push(todo)
    localStorage.setItem('TodoList', JSON.stringify(items))
}

function getLocalStorage(){
    return localStorage.getItem('TodoList')
        ? JSON.parse(localStorage.getItem('TodoList'))
        : []
}

function removeFromlocalStorage(id){
    let items = getLocalStorage()
    items = items.filter((item)=>{
        if (item.id !== id){
            return item
        }
    })
    localStorage.setItem('TodoList', JSON.stringify(items))
}

function editLocalStorage(id, value){
    let items = getLocalStorage()
    items = items.map((item)=>{
        if (item.id !== id){
            item.value = value
        }
        return item
    })
    localStorage.setItem('TodoList', JSON.stringify(items))
}

function setupItems(){
    let items = getLocalStorage()
    if (items.length > 0){
        items.forEach((item)=>{
            createListItem(item.id, item.value)
        })
        TodoContainer.classList.add('show-container')
    }
}

function createListItem(id,value){
    const element = document.createElement('article')
        let attr = document.createAttribute('data-id')
        attr.value = id
        element.setAttributeNode(attr)
        element.classList.add('todo-item')
        element.innerHTML = `<p class="title">${value}</p>
                                <div class="btn-container">
                                    <button class="edit-btn">Edit</button>
                                    <button class="delete-btn">❌</button>
                                </div>`
        const DeleteBtn = element.querySelector('.delete-btn')
        const EditBtn = element.querySelector('.edit-btn')
        DeleteBtn.addEventListener('click', DeleteItem)
        EditBtn.addEventListener('click', EditItems)

        TodoList.appendChild(element)
}