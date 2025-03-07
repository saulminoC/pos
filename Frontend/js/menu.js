// Función para abrir el menú
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    sidebar.classList.toggle('open'); // Alterna la visibilidad del menú lateral
    mainContent.classList.toggle('shifted'); // Desplaza el contenido
}

// Función para cerrar el menú
function closeMenu() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    sidebar.classList.remove('open'); // Cierra el menú lateral
    mainContent.classList.remove('shifted'); // Vuelve el contenido a su lugar
}

// Cerrar el menú si se hace clic fuera de él
window.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
    }
});