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

const pokemonCache = {};
let currentUrl = "";
let pokemon = {};
let next = "";
let previous = "";
let currentImage = 'front_default';

window.onload = async () => {
    const botonMenu = document.getElementById("barras-menu");
    botonMenu.onclick = () => {
        const menu = document.getElementById("menu-movil");
        if (menu.style.display == "none")
            menu.style.display = "block";
        else
            menu.style.display = "none";
    };

    document.getElementById("loading").style.display = "block";
    await getDataUrl('https://pokeapi.co/api/v2/pokemon');
    
    document.getElementById("next").addEventListener("click", async () => {
        await getDataUrl(next);
    });

    document.getElementById("previous").addEventListener("click", async () => {
        await getDataUrl(previous);
    });

    setInterval(() => {
        currentImage = currentImage === 'front_default' ? 'back_default' : 'front_default';
        updateImages(pokemonCache[currentUrl].results);
    }, 1000);
}

async function getDataUrl(url) {
    document.getElementById("loading").style.display = "none";
    try {
        // Verificar si los datos ya están en caché
        //if (pokemonCache[url]) {
        //    handlePaginationButtons(pokemonCache[url]);
        //    mostrarDatosIniciales(pokemonCache[url].results);
        //    return; // No es necesario hacer una solicitud de red
        //}

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        handlePaginationButtons(data);
        await Promise.all(data.results.map(loadPokemonData));
        mostrarDatosIniciales(data.results);

        // Almacenar los datos recuperados en la caché local
        pokemonCache[url] = data;
        currentUrl = url; // Actualizar la URL actual
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
        pokemon[data.name] = {
        front_default: data.sprites.front_default,
        back_default: data.sprites.back_default,
        types: data.types.map(typeObj => typeObj.type.name).join(", "),
        id: data.id,
        exp: data.base_experience
    };
}

function handlePaginationButtons(data) {
    next = data.next;
    previous = data.previous;
    document.getElementById("next").style.display = next ? "inline" : "none";
    document.getElementById("previous").style.display = previous ? "inline" : "none";
}

async function mostrarDatosIniciales(pkmnList) {
    document.getElementById("loading").style.display = "none"; // Ocultar el loading
    const contenidoPkmn = pkmnList.map(pkmn => `
        <article id="${pkmn.name}" class="pokemon-card" style="background: ${getBackgroundColor(pkmn)}">
            <h3>${pkmn.name}</h3>
            <img id="pokemonImg-${pkmn.name}" src="${pokemon[pkmn.name][currentImage]}" alt="">
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
        return typeColors[types[0]]; 
    } else {
        const color1 = typeColors[types[0]];
        const color2 = typeColors[types[1]];
        return `linear-gradient(to bottom right, ${color1} 30%, ${color2} 70%)`;
    }
}

function updateImages(pkmnList) {
    pkmnList.forEach(pkmn => {
        const imgElement = document.getElementById(`pokemonImg-${pkmn.name}`);
        if (imgElement)
            imgElement.src = pokemon[pkmn.name][currentImage];
    });
}

function updateImagesPrevious(pkmnList) {
    pkmnList.forEach(pkmn => {
        const imgElement = document.getElementById(`pokemonImg-${pkmn.name}`);
        if (imgElement)
            imgElement.src = pokemon[pkmn.name][currentImage];
    });
}
