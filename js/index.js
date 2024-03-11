window.onload = () => {
    const botonMenu = document.getElementById("barras-menu");
    botonMenu.onclick = () => {
        const menu = document.getElementById("menu-movil");
        if (menu.classList.contains("menu-movil")) {
            menu.classList.remove("menu-movil");
        } else {
            menu.classList.add("menu-movil");
        }
    }
}