const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const craneRegistration = document.getElementById('crane-registration');
const carRegistration = document.getElementById('car-registration');

const registerCraneForm = document.getElementById('register-crane-form');
const registerCarForm = document.getElementById('register-car-form');

const craneList = document.getElementById('crane-list');
const carList = document.getElementById('car-list');

const assignedCraneSelect = document.getElementById('assigned-crane');

function toggleDisplay(element) {
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
}

loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Implementar la lógica de inicio de sesión aquí
    if (username && password) {
        console.log(`Iniciando sesión para: ${username}`);
        // Aquí se podría agregar una llamada a una API de autenticación
        toggleDisplay(loginForm);
        // Mostrar opciones post-login
    } else {
        alert('Por favor, ingrese un nombre de usuario y contraseña válidos.');
    }
});

// Registro de grúa
registerCraneForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(registerCraneForm);
    const craneData = Object.fromEntries(formData.entries());

    // Implementar la lógica de registro de grúa aquí
    console.log('Datos de la grúa registrada:', craneData);
    // Aquí se podría agregar una llamada a una API para guardar los datos
    
    // Actualizar la lista de grúas
    updateCraneList(craneData);
    
    registerCraneForm.reset();
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
    listItem.textContent = `Grúa ${craneData['numero-grua']} - Conductor: ${craneData['nombre-conductor']}`;
    craneList.appendChild(listItem);
    
    // Actualizar el select de grúas asignadas
    const option = document.createElement('option');
    option.value = craneData['numero-grua'];
    option.textContent = `Grúa ${craneData['numero-grua']}`;
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
    // Aquí se podrían cargar datos iniciales, como listas de grúas y vehículos desde una API
});