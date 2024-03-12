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
    document.getElementById("loading").style.display = "none";
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
    try {
        const response = await fetch(pokemonData.url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        cargarInfoPkmn(data);
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
}

function cargarInfoPkmn(data) {
    const types = data.types.map(typeObj => typeObj.type.name).join(", ");
    pokemon[data.name] = {
        img: data.sprites.front_default,
        types: types !== "" ? types : "Unknown",
        id: data.id,
        exp: data.base_experience
    };
}

function handlePaginationButtons(data) {
    document.getElementById("next").style.display = data.next ? "inline" : "none";
    document.getElementById("previous").style.display = data.previous ? "inline" : "none";
    next = data.next;
    previous = data.previous;
}

const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"
};

async function mostrarDatosIniciales(pkmnList) {
    const contenidoPkmn = pkmnList.map(pkmn => `
        <article id="${pkmn.name}" class="pokemon-card" style="background: ${getBackgroundColor(pkmn)}">
            <h3>${pkmn.name}</h3>
            <img src="${pokemon[pkmn.name].img}" alt="">
            <div>
                <p><label>Type: </label><span>${pokemon[pkmn.name].types}</span></p>
                <p><label>Id: </label><span>${pokemon[pkmn.name].id}</span></p>
                <p><label>Exp: </label><span>${pokemon[pkmn.name].exp}</span></p> 
            </div>
        </article>
    `).join("");
    document.getElementById("pkmnContainer").innerHTML = contenidoPkmn;
}

function getBackgroundColor(pkmn) {
    const types = pokemon[pkmn.name].types.split(", ");
    if (types.length === 1) {
        return typeColors[types[0]] || "gray"; // Si el tipo no tiene un color asignado, se usará gris
    } else {
        // Para tipos múltiples, calculamos un degradado entre los colores de los tipos
        const color1 = typeColors[types[0]] || "gray";
        const color2 = typeColors[types[1]] || "gray";
        return `linear-gradient(to bottom right, ${color1} 30%, ${color2} 70%)`;
        //return `linear-gradient(45deg, ${color1}, ${color2})`;
        //return `linear-gradient(45deg, ${color1} 0%, ${color1} 50%, ${color2} 50%, ${color2} 100%)`;
    }
}