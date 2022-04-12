window.addEventListener('DOMContentLoaded', function() {

    console.log('e');
    const menu = document.getElementById('menu');
    const openMenu = document.getElementById('openMenu');
    const closeMenu = document.getElementById('closeMenu');
    
    openMenu.addEventListener('click', e=>menu.classList.remove('d-none'))
    closeMenu.addEventListener('click', e=>menu.classList.add('d-none'))
})