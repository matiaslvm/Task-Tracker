document.getElementById('taskForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío del formulario de forma tradicional

    const description = document.getElementById('description').value; // Obtiene la descripción

    try {
        const response = await fetch('/add-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description }) // Envía la descripción en el cuerpo de la solicitud
        });

        if (response.ok) {
            alert('Task added successfully!'); // Muestra un mensaje de éxito
            document.getElementById('description').value = ''; // Limpia el campo
        } else {
            // Muestra un mensaje de error con la respuesta del servidor
            const errorText = await response.text();
            alert(`Error adding task: ${errorText}`);
        }
    } catch (error) {
        console.error('Error sending request:', error);
        alert('Error adding task.');
    }
});
