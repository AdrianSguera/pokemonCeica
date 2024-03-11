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

    document.getElementById("loading").style.display="block";
    fetch('https://pokeapi.co/api/v2/pokemon')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("loading").style.display="none";
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });

}