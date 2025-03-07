// Obtener los elementos del menú y los botones
const menu = document.getElementById('menu');
const hamburgerBtn = document.getElementById('hamburger-btn');
const closeBtn = document.getElementById('close-btn');

// Abrir el menú al hacer clic en el icono de hamburguesa
hamburgerBtn.addEventListener('click', () => {
    menu.classList.add('open');
    menu.classList.remove('menu-closed');
});

// Cerrar el menú al hacer clic en el icono de cerrar
closeBtn.addEventListener('click', () => {
    menu.classList.remove('open');
    menu.classList.add('menu-closed');
});
