#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, 'tasks.json');

// Initialize task file if it doesn't exist
if (!fs.existsSync('./tasks.json')) {
  fs.writeFileSync('./tasks.json', '[]');
}

function readTasks() {
    const tasksData = fs.readFileSync(tasksFilePath);    
    return JSON.parse(tasksData);
}

function writeTasks(tasks) {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 5));
}

function addTask(title) {
    const tasks = readTasks();
    const id = tasks.length;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    tasks.push({ id, title, status: 'todo', createdAt, updatedAt });
    writeTasks(tasks);
    console.log(`Task added: ${title}`);
}

function updateTask(index, status) {
    const tasks = readTasks();
    if (tasks[index]) {
        tasks[index].status = status;
        tasks[index].updatedAt = new Date().toISOString();
        writeTasks(tasks);
        console.log(`Task updated: ${tasks[index].title} to ${status}`);
    } else {
        console.log(`Task not found: ${index}`);
    }
}
 
function deleteTask(index) {    
     const tasks = readTasks();
  if (index < 0 || index >= tasks.length) {
    console.error("Invalid task index.");
    return;
  }
  const removed = tasks.splice(index, 1);
  writeTasks(tasks);
  console.log(`Deleted task: "${removed[0].title}"`);
}

function listTasks(filter=null) {
    const tasks = readTasks();
    let filteredTasks = tasks;

    if (filter)
        filteredTasks = tasks.filter(task => task.status === filter);

    if (filteredTasks.length === 0) {
        console.log("No tasks found.");
        return;
    }
    else {  
        console.log("Tasks:");
        filteredTasks.forEach((task, index) => {
            console.log(`${index}: ${task.title} [${task.status}]`);
        });
    }
}

function handleArguments() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'add':
            const taskTitle = args.slice(1).join(' ');
            if (!taskTitle) {   
                console.error("Task title is required.");
                return;
            }
            addTask(taskTitle);            
            break;
        case 'update':
            const updateIndex = parseInt(args[1], 10);
            const status = args[2];
            if (isNaN(updateIndex) || !['todo', 'in-progress', 'done'].includes(status)) {
                console.error("Usage: update <task_index> <'todo'|'in-progress'|'done'>");
                return;
            }
            updateTask(updateIndex, status);
            break;
        case 'delete':
            const deleteIndex = parseInt(args[1], 10);
            if (isNaN(deleteIndex)) {
                console.error("Usage: delete <task_index>");
                return;
            }
            deleteTask(deleteIndex);
            break;
        case 'list':
            listTasks();
            break;
        case 'list-done':
            listTasks('done');
            break;
        case 'list-todo':
            listTasks('todo');
            break;
        case 'list-in-progress':
            listTasks('in-progress');
            break;
        default:
            console.error("Unknown command. Available commands: add, update, delete, list, list-done, list-todo, list-in-progress");
        }
}

handleArguments();