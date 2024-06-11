/**
 * This is a module that represents a Pokemon repository.
 */
const pokemonRepository = (() => {

    /**
     * A class that represents a Pokemon object.
     */
    class Pokemon {
        /**
         * 
         * @param {string} name The name of the Pokemon
         * @param {string} imageLink A URL that points to an image of the Pokemon
         * @param {*} height The height of the Pokemon
         * @param {*} types The types of the Pokemon
         */
        constructor(name, imageLink, height, types) {
            this.name = name;
            this.imageLink = imageLink;
            this.height = height;
            this.types = types;
        }
    }

    /**
     * A private array that holds all Pokemon objects.
     */
    let _pokemonList = [];

    /**
     * This function adds a Pokemon object to the pokemon repository.
     * @param {Pokemon} pokemon The Pokemon object to be added to the pokemon repository.
     */
    function add(pokemon) {
        /*I think instanceof has the same functionality as typeof === 'object' and iterating over Object.keys()*/
        pokemon instanceof Pokemon ? _pokemonList.push(pokemon) : console.error("You can only add objects of the Pokemon class");
    }

    /**
     * This function searches for a Pokemon object in the pokemon repository by name.
     * @param {*} pokemonName The name of the Pokemon to search for.
     * @returns An array of Pokemon objects that have the same name as the one provided in the argument.
     */
    function searchByName(pokemonName) {
        if (typeof pokemonName === "string") {
            return _pokemonList.filter((pokemon) => pokemon.name === pokemonName);
        } else {
            console.error("The name of the Pokemon must be a string");
            return null;
        }
    }

    /**
     * This function adds a Pokemon object to the list of Pokemon objects in the DOM.
     * @param {*} pokemon The Pokemon object to be added to the list of Pokemon objects in the DOM.
     */
    function addListItem(pokemon) {
        if (pokemon instanceof Pokemon) {
            const pokemonList = document.querySelector(".pokemon-list");
            const listItem = document.createElement("li");
            const button = document.createElement("button");
            button.innerText = pokemon.name;
            button.addEventListener("click", () => showDetails(pokemon));
            button.classList.add("pokemon-button");
            listItem.appendChild(button);
            pokemonList.appendChild(listItem);
        } else {
            console.error("You can only add objects of the Pokemon class");
        }
    }

    /**
     * This function shows the details of a Pokemon object.
     * @param {*} pokemon The Pokemon object whose details are to be shown.
     */
    function showDetails(pokemon) {
        console.log(pokemon);
    }
    /**
     * A helper function that fetches URLs for all pokemon from the pokeapi.co API.
     * @returns {Promise<Array<string>>} An array of URLs that point to the data of all pokemon in the pokeapi.co API.
     */
    async function _getPokemonURLs() {
        const urlList = [];
        let response = await fetch(new Request("https://pokeapi.co/api/v2/pokemon?limit=1302&offset=0"));
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        } else {
            response = await response.json();
            response.results.forEach((pokemon) => {
                urlList.push(pokemon.url);
            });
        }
        return urlList;
    }

    /**
     * Fetches data for all pokemon from the Pokemon API and adds them to the pokemon repository.
     */
    async function getAll() {
        /* Wait until the array that contains URLs for all pokemon is ready, then send a HTTP request to every URL. */
        (await _getPokemonURLs()).map(async (url) => await fetch(url)).forEach((httpRequest) => {
            /* Wait until the HTTP response for a requested URL is ready.*/
            httpRequest.then(async (httpResponse) => {
                /* Convert the HTTP Response to JSON data.*/
                const pokemonJSON = await httpResponse.json();
                /*Create a new Pokemon object with the JSON data. */
                const pokemon = new Pokemon(
                    pokemonJSON.name,
                    pokemonJSON.sprites.front_default,
                    pokemonJSON.height,
                    pokemonJSON.types.map((type) => type.type.name)
                );
                /* Add the Pokemon object to the pokemon repository. */
                add(pokemon);
                /* Add the Pokemon object to the list of Pokemon objects in the DOM. */
                addListItem(pokemon);
            });
        });
    }

    /* Return the pokemon repositories public stuff. */
    return {
        Pokemon: Pokemon,
        add: add,
        getAll: getAll,
        searchByName: searchByName,
        addListItem: addListItem,
        showDetails: showDetails
    };
})();

pokemonRepository.getAll();