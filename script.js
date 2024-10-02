const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Conexión a la base de datos
const db = require('./db');

const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const craneRegistration = document.getElementById('crane-registration');
const carRegistration = document.getElementById('car-registration');

const registerCraneForm = document.getElementById('register-crane-form');
const registerCarForm = document.getElementById('register-car-form');

const craneList = document.getElementById('crane-list');
const carList = document.getElementById('car-list');

const assignedCraneSelect = document.getElementById('assigned-crane');

// Obtener el formulario y los selectores
let sendCraneForm = null;
const craneIdSelector = document.getElementById('crane-id');
const carIdSelector = document.getElementById('car-id');

function toggleDisplay(element) {
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
}

loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Implementar la lógica de inicio de sesión aquí
    if (username && password) {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                console.log('Inicio de sesión exitoso');
                localStorage.setItem('token', data.token);
                toggleDisplay(loginForm);
                // Mostrar opciones post-login
            } else {
                alert(data.message || 'Error en el inicio de sesión');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error en el inicio de sesión');
        });
    } else {
        alert('Por favor, ingrese un nombre de usuario y contraseña válidos.');
    }
});

// Endpoint para crear una grúa
app.post('/cranes', (req, res) => {
    const { name, type } = req.body;

    // Verificar si el usuario tiene permiso para crear grúas
    if (!req.user.hasPermission('create-crane')) {
        res.status(403).send({ message: 'No tiene permiso para crear grúas' });
    } else {
        // Crear la grúa en la base de datos
        db.query('INSERT INTO cranes SET ?', { name, type }, (err, results) => {
            if (err) {
                res.status(500).send({ message: 'Error al crear la grúa' });
            } else {
                res.send({ message: 'Grúa creada con éxito' });
            }
        });
    }
});

// Endpoint para leer todas las grúas
app.get('/cranes', (req, res) => {
    // Leer todas las grúas de la base de datos
    db.query('SELECT * FROM cranes', (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error al leer las grúas' });
        } else {
            res.send(results);
        }
    });
});

// Endpoint para actualizar una grúa
app.put('/cranes/:id', (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;

    // Verificar si el usuario tiene permiso para actualizar grúas
    if (!req.user.hasPermission('update-crane')) {
        res.status(403).send({ message: 'No tiene permiso para actualizar grúas' });
    } else {
        // Actualizar la grúa en la base de datos
        db.query('UPDATE cranes SET ? WHERE id = ?', [{ name, type }, id], (err, results) => {
            if (err) {
                res.status(500).send({ message: 'Error al actualizar la grúa' });
            } else {
                res.send({ message: 'Grúa actualizada con éxito' });
            }
        });
    }
});

// Registro de grúa
registerCraneForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(registerCraneForm);
    const craneData = Object.fromEntries(formData.entries());

    // Implementar la lógica de registro de grúa aquí
    fetch('/cranes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(craneData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        if (data.message === 'Grúa creada con éxito') {
            // Actualizar la lista de grúas
            updateCraneList(craneData);
            registerCraneForm.reset();
        } else {
            alert(data.message || 'Error al registrar la grúa');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al registrar la grúa');
    });
});

// Registro de vehículo
registerCarForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(registerCarForm);
    const carData = Object.fromEntries(formData.entries());

    // Implementar la lógica de registro de vehículo aquí
    console.log('Datos del vehículo registrado:', carData);
    // Aquí se podría agregar una llamada a una API para guardar los datos
    
    // Actualizar la lista de vehículos
    updateCarList(carData);
    
    registerCarForm.reset();
});

function updateCraneList(craneData) {
    const listItem = document.createElement('li');
    listItem.textContent = `Grúa ${craneData.name} - Tipo: ${craneData.type}`;
    craneList.appendChild(listItem);
    
    // Actualizar el select de grúas asignadas
    const option = document.createElement('option');
    option.value = craneData.name;
    option.textContent = `Grúa ${craneData.name}`;
    assignedCraneSelect.appendChild(option);
}

function updateCarList(carData) {
    const listItem = document.createElement('li');
    listItem.textContent = `${carData.marca} ${carData.modelo} - Placas: ${carData.placas}`;
    carList.appendChild(listItem);
}

// Cerrar modales al hacer clic fuera
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        toggleDisplay(event.target);
    }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Cargar la lista de grúas desde la API
    fetch('/cranes', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(cranes => {
        cranes.forEach(crane => updateCraneList(crane));
    })
    .catch(error => {
        console.error('Error al cargar las grúas:', error);
    });
});

// Agregar evento de submit al formulario
sendCraneForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const craneId = craneIdSelector.value;
    const carId = carIdSelector.value;

    // Verificar si se seleccionó una grúa y un carro
    if (craneId === '' || carId === '') {
        alert('Seleccione una grúa y un carro');
        return;
    }

    // Enviar la solicitud al servidor
    fetch('/send-crane', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            craneId,
            carId
        })
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            alert('Grúa enviada con éxito');
        } else {
            alert('Error al enviar la grúa');
        }
    })
    .catch((error) => {
        console.error(error);
    });
});