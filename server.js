const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;
const tasksFilePath = path.join(__dirname, 'tasks.json');

app.use(express.json()); // Permite manejar datos JSON
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public'

const loadTasks = () => {
    try {
        if (fs.existsSync(tasksFilePath)) {
            const data = fs.readFileSync(tasksFilePath);
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Error reading tasks file:', error);
        return [];
    }
};

const saveTasks = (tasks) => {
    try {
        fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
    } catch (error) {
        console.error('Error writing tasks file:', error);
    }
};

app.post('/add-task', (req, res) => {
    try {
        const { description } = req.body; // Obtiene la descripción de la solicitud
        if (!description) {
            return res.status(400).send('Description is required');
        }
        
        const tasks = loadTasks(); // Carga las tareas actuales
        const newTask = {
            id: uuidv4(), // Genera un ID único para la tarea
            description,
            status: 'todo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        tasks.push(newTask); // Agrega la nueva tarea a la lista
        saveTasks(tasks); // Guarda las tareas actualizadas
        res.sendStatus(200); // Responde con un estado de éxito
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).send('Error adding task');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
