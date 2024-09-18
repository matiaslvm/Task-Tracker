const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { v4: uuidv4 } = require('uuid');

const tasksFilePath = path.join(__dirname, 'tasks.json');

const loadTasks = () => {
    if (fs.existsSync(tasksFilePath)) {
        const data = fs.readFileSync(tasksFilePath);
        return JSON.parse(data);
    }
    return [];
};

const saveTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

const addTask = (description) => {
    const tasks = loadTasks();
    const newTask = {
        id: uuidv4(), // Genera un ID único
        description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log('Task added.');
};

const listTasks = () => {
    const tasks = loadTasks();
    tasks.forEach((task, index) => {
        console.log(`${index + 1}. [${task.status}] ${task.description} (Created: ${task.createdAt}, Updated: ${task.updatedAt})`);
    });
};

const updateTask = (id, status) => {
    const tasks = loadTasks();
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.status = status;
        task.updatedAt = new Date().toISOString();
        saveTasks(tasks);
        console.log('Task updated.');
    } else {
        console.log('Task not found.');
    }
};

yargs
    .command({
        command: 'add',
        describe: 'Add a new task',
        builder: {
            description: {
                describe: 'Task description',
                demandOption: true,
                type: 'string'
            }
        },
        handler(argv) {
            addTask(argv.description);
        }
    })
    .command({
        command: 'list',
        describe: 'List all tasks',
        handler() {
            listTasks();
        }
    })
    .command({
        command: 'update',
        describe: 'Update the status of a task',
        builder: {
            id: {
                describe: 'Task ID',
                demandOption: true,
                type: 'string'
            },
            status: {
                describe: 'New status',
                choices: ['todo', 'in-progress', 'done'],
                demandOption: true,
                type: 'string'
            }
        },
        handler(argv) {
            updateTask(argv.id, argv.status);
        }
    })
    .demandCommand(1, 'You need to specify a command.')
    .help()
    .argv;
