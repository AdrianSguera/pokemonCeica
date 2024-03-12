var pokemon = {};
var next = "";
var previous = "";

window.onload = async () => {
    const botonMenu = document.getElementById("barras-menu");
    botonMenu.onclick = () => {
        const menu = document.getElementById("menu-movil");
        menu.classList.toggle("menu-movil");
    };

    document.getElementById("loading").style.display = "block";
    await getDataUrl('https://pokeapi.co/api/v2/pokemon');
    
    document.getElementById("next").addEventListener("click", async () => {
        await getDataUrl(next);
    });

    document.getElementById("previous").addEventListener("click", async () => {
        await getDataUrl(previous);
    });
}

async function getDataUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        handlePaginationButtons(data);
        await Promise.all(data.results.map(loadPokemonData));
        mostrarDatosIniciales(data.results);
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
}

async function loadPokemonData(pokemonData) {
    document.getElementById("loading").style.display = "none";
    try {
        if (!pokemon[pokemonData.name]) {
            const response = await fetch(pokemonData.url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            cargarInfoPkmn(data);
        }
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
}

function handlePaginationButtons(data) {
    document.getElementById("next").style.display = data.next ? "inline" : "none";
    document.getElementById("previous").style.display = data.previous ? "inline" : "none";
    next = data.next;
    previous = data.previous;
}

function cargarInfoPkmn(data) {
    pokemon[data.name] = {
        img: data.sprites.front_default,
        types: data.types.map(typeObj => typeObj.type.name).join(", "),
        id: data.id,
        exp: data.base_experience
    };
}

function mostrarDatosIniciales(pkmnList) {
    const contenidoPkmn = pkmnList.map(pkmn => `
        <article id="${pkmn.name}">
            <h3>${pkmn.name}</h3>
            <img src="${pokemon[pkmn.name].img}" alt="" style="width: 100px; height: 100px;">
            <div>
                <p><label>Types: </label><span>${pokemon[pkmn.name].types}</span></p>
                <p><label>Id: </label><span>${pokemon[pkmn.name].id}</span></p>
                <p><label>Exp: </label><span>${pokemon[pkmn.name].exp}</span></p> 
            </div>
        </article>
    `).join("");
    document.getElementById("pkmnContainer").innerHTML = contenidoPkmn;
}
