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

let pokemonData = [];
let currentImage = 'front_default';
let startIndex = 0;
const allPokemonTypes = [
    "bug", "dark", "dragon", "electric", "fairy", "fighting", "fire", "flying",
    "ghost", "grass", "ground", "ice", "normal", "poison", "psychic", "rock", "steel", "water"
];

window.onload = async () => {
    document.getElementById("loading").style.display = "block";
    await fetchAndSavePokemonData();
    document.getElementById("loading").style.display = "none";

    const botonMenu = document.getElementById("barras-menu");
    botonMenu.onclick = () => {
        const menu = document.getElementById("menu-movil");
        menu.style.display = menu.style.display === "none" ? "block" : "none";
    };

    document.getElementById("next").addEventListener("click", () => {
        mostrarSiguientePokemon();
    });
    document.getElementById("previous").addEventListener("click", () => {
        mostrarPokemonAnterior();
    });

    setInterval(() => {
        currentImage = currentImage === 'front_default' ? 'back_default' : 'front_default';
        updateImages();
    }, 1000);

    mostrarDatosIniciales();

    document.getElementById("pokemonSearch").addEventListener("input", () => {
        filterPokemon();
    });

    // Crear opciones para la lista desplegable
    const selectElement = document.getElementById("pokemonTypes");
    allPokemonTypes.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Capitalizar la primera letra
        selectElement.appendChild(option);
    });

    // Escuchar el evento de cambio en la lista desplegable
    selectElement.addEventListener("change", () => {
        const selectedType = selectElement.value.toLowerCase(); // Convertir a minúsculas
        const filteredPokemon = filterPokemonByType(pokemonData, selectedType);
        mostrarDatosIniciales(filteredPokemon);
    });
}

async function fetchAndSavePokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const pokemonList = [];
        for (const pokemon of data.results) {
            const pokemonResponse = await fetch(pokemon.url);
            if (!pokemonResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const pokemonData = await pokemonResponse.json();

            const pokemonObject = {
                name: pokemonData.name,
                front_default: pokemonData.sprites.front_default,
                back_default: pokemonData.sprites.back_default,
                types: pokemonData.types.map(typeObj => typeObj.type.name).join(", "),
                id: pokemonData.id,
                exp: pokemonData.base_experience
            };
            pokemonList.push(pokemonObject);
        }

        pokemonData = pokemonList;
        calcularPaginacion();
        console.log('Pokémon data fetched and saved successfully.');
    } catch (error) {
        console.error('There was a problem:', error);
    }
}

function mostrarSiguientePokemon() {
    startIndex += 12;
    mostrarDatosIniciales();
}

function mostrarPokemonAnterior() {
    startIndex -= 12;
    if (startIndex < 0) {
        startIndex = 0;
    }
    mostrarDatosIniciales();
}

function calcularPaginacion() {
    if (startIndex === 0) {
        document.getElementById("previous").disabled = true;
    } else {
        document.getElementById("previous").disabled = false;
    }

    if (startIndex + 12 >= pokemonData.length) {
        document.getElementById("next").disabled = true;
    } else {
        document.getElementById("next").disabled = false;
    }
}

function getBackgroundColor(pkmn) {
    const types = pkmn.types.split(", ");
    if (types.length === 1) {
        return typeColors[types[0]]; 
    } else {
        const color1 = typeColors[types[0]];
        const color2 = typeColors[types[1]];
        return `linear-gradient(to bottom right, ${color1} 30%, ${color2} 70%)`;
    }
}

function updateImages() {
    const pkmnList = pokemonData.slice(startIndex, startIndex + 12);
    pkmnList.forEach(pkmn => {
        const imgElement = document.getElementById(`pokemonImg-${pkmn.name}`);
        if (imgElement) {
            if (currentImage === 'front_default') {
                if (pkmn.back_default) {
                    imgElement.src = pkmn.back_default;
                }
            } else {
                imgElement.src = pkmn.front_default;
            }
        }
    });
}

function generatePokemonHTML(pkmn) {
    return `
        <article id="${pkmn.name}" class="pokemon-card" style="background: ${getBackgroundColor(pkmn)}">
            <h3>${pkmn.name}</h3>
            <img id="pokemonImg-${pkmn.name}" src="${pkmn.front_default}" alt="">
            <div>
                <p><label>Type: </label><span>${pkmn.types}</span></p>
                <p><label>Id: </label><span>${pkmn.id}</span></p>
                <p><label>Exp: </label><span>${pkmn.exp}</span></p> 
            </div>
        </article>
    `;
}

function filterPokemon() {
    const searchTerm = document.getElementById("pokemonSearch").value.toLowerCase();
    const filteredPokemon = pokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
    mostrarPokemon(filteredPokemon);
}

function mostrarDatosIniciales(filteredPokemon = null) {
    const pkmnList = filteredPokemon ? filteredPokemon : pokemonData.slice(startIndex, startIndex + 12);
    mostrarPokemon(pkmnList);
}


function mostrarPokemon(pokemonList) {
    const contenidoPkmn = pokemonList.map(pkmn => generatePokemonHTML(pkmn)).join("");
    document.getElementById("pkmnContainer").innerHTML = contenidoPkmn;
}

function filterPokemonByType(pokemonList, type) {
    if (!type) {
        return pokemonList;
    }
    return pokemonList.filter(pokemon => {
        const tipos = pokemon.types.split(", ");
        return tipos.includes(type);
    });
}
