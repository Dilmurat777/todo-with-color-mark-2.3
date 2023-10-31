const form = document.querySelector('#todoForm');
const inputTodo = document.querySelector('#new-todo');
const todoList = document.querySelector('#todo-list');
const notification = document.querySelector('.notification');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;
renderTodo();

//Form todo
form.addEventListener('submit', (e) => {
  e.preventDefault();
  saveTodo();
  renderTodo();
	localStorage.setItem('todos', JSON.stringify(todos));
});

//Save Todo
function saveTodo() {
  const textInput = inputTodo.value;
  const isEmpty = textInput === '';
  const isDuplicate = todos.some((todo) => todo.value === inputTodo.value);

  if (isEmpty) {
    showNotification('You have to write some todo');
  } else if (isDuplicate) {
    showNotification('You already have same world');
  } else {
    if (EditTodoId >=0) {
      todos = todos.map((todo, index) => {
        return {
          ...todo,
          value: index === EditTodoId ? textInput : todo.value,
        };
      });
      EditTodoId - 1;
    } else {
      todos.push({
        value: textInput,
        checked: false,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      });
    }
    inputTodo.value = '';
    inputTodo.focus();
  }
	localStorage.setItem('todos', JSON.stringify(todos));
}

//Render todo list

function renderTodo() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    todoList.innerHTML += `
				<div class="todo" id="${index}">
					<i class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}" style='color: ${
      todo.color
    }' data-action='check'></i>
					<p class="${todo.checked ? 'checked' : ''}" data-action='check'>${todo.value}</p>
					<i class="bi bi-pencil-square" data-action='edit'></i>
					<i class="bi bi-trash" data-action='delete'></i>
				</div>
	`;
  });
	localStorage.setItem('todos', JSON.stringify(todos));
}

todoList.addEventListener('click', (e) => {
  const targetId = e.target;
  const parentElementId = targetId.parentNode;
  if (parentElementId.className !== 'todo') return;
  const todo = parentElementId;
  const todoId = Number(todo.id);
  const action = targetId.dataset.action;

  action === 'check' && checkTodo(todoId);
  action === 'edit' && editTodo(todoId);
  action === 'delete' && deleteTodo(todoId);
});

function checkTodo(todoId) {
  todos = todos.map((todo, index) => {
    return {
      ...todo,
      checked: index === todoId ? !todo.checked : todo.checked,
    };
  });
  renderTodo();
	localStorage.setItem('todos', JSON.stringify(todos));
}

//Edit todo
function editTodo(todoId) {
  inputTodo.value = todos[todoId].value;
  EditTodoId = todoId;
}

//Delete todo
function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  renderTodo();
	localStorage.setItem('todos', JSON.stringify(todos));
}

//Show message if about error

function showNotification(msg) {
  notification.innerHTML = msg;

  notification.classList.add('notif-enter');

  setTimeout(() => {
    notification.classList.remove('notif-enter');
  }, 2000);
}
