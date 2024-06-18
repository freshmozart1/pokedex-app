/**
 * This is a module that represents a Pokemon repository.
 */
const pokemonRepository = (() => {

    /**
     * A class that represents a Pokemon object.
     */
    class Pokemon {
        /**
         * @param {string} name The name of the Pokemon
         * @param {string} imageLink A URL that points to an image of the Pokemon
         * @param {*} height The height of the Pokemon
         * @param {*} types The types of the Pokemon
         * @param {*} url The URL that points to the data of the Pokemon
         */
        constructor(name, imageLink, height, types, url) {
            this.name = name;
            this.imageLink = imageLink;
            this.height = height;
            this.types = types;
            this.url = url;
        }
    }

    /**
     * A private array that holds all Pokemon objects.
     */
    let _pokemonList = [];

    let _pokemonDialog = document.querySelector("#pokemon-dialog");

    /**
     * This function adds a Pokemon object to the pokemon repository.
     * @param {Pokemon} pokemon The Pokemon object to be added to the pokemon repository.
     */
    function add(pokemon) {
        if (pokemon instanceof Pokemon) {
            _pokemonList.push(pokemon);
        } else {
            throw new Error("You can only add objects of the Pokemon class");
        }
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
            throw new Error("The name of the Pokemon must be a string");
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
            button.addEventListener("click", () => openDetailsModal(pokemon));
            button.classList.add("pokemon-button");
            listItem.appendChild(button);
            pokemonList.appendChild(listItem);
        } else {
            throw new Error("You can only add objects of the Pokemon class");
        }
    }

    /**
     * This function logs the details of a Pokemon object.
     * @param {*} pokemon The Pokemon object whose details are to be shown.
     */
    function openDetailsModal(pokemon) {
        if (pokemon instanceof Pokemon) {
            loadDetails(pokemon).then(() => {
                _pokemonDialog.innerText = '';
                /*I need the shitSolutionButton to prevent autofocus on 
                the close button after the user opened the modal.*/
                let shitSolutionButton = document.createElement('button');
                shitSolutionButton.setAttribute('width', '0');
                shitSolutionButton.setAttribute('height', '0');
                shitSolutionButton.style.padding = '0';
                shitSolutionButton.style.margin = '0';
                shitSolutionButton.style.border = '0';
                shitSolutionButton.style.outline = '0';
                _pokemonDialog.appendChild(shitSolutionButton);
                let closeButton = document.createElement('button');
                closeButton.setAttribute('aria-label', 'Close');
                closeButton.innerHTML = '&#10006;';
                closeButton.id = 'close-info-modal';
                closeButton.addEventListener('click', () => {
                    document.body.style.overflow = 'auto';
                    _pokemonDialog.close();
                });
                _pokemonDialog.appendChild(closeButton);
                let pokemonImage = document.createElement('img');
                pokemonImage.src = pokemon.imageLink;
                pokemonImage.alt = pokemon.name;
                _pokemonDialog.appendChild(pokemonImage);
                let pokemonTable = document.createElement('table')
                let pokemonTableHead = document.createElement('thead');
                let pokemonTableHeadCell = document.createElement('th');
                pokemonTableHeadCell.innerText = pokemon.name;
                let pokemonTableHeadRow = document.createElement('tr');
                pokemonTableHeadRow.appendChild(pokemonTableHeadCell);
                pokemonTableHead.appendChild(pokemonTableHeadRow);
                pokemonTable.appendChild(pokemonTableHead);
                let pokemonTableBody = document.createElement('tbody');
                let pokemonHeightRow = document.createElement('tr');
                let pokemonHeightRowName = document.createElement('td');
                pokemonHeightRowName.innerText = 'Height';
                let pokemonHeightRowValue = document.createElement('td');
                pokemonHeightRowValue.innerText = pokemon.height;
                pokemonHeightRow.appendChild(pokemonHeightRowName);
                pokemonHeightRow.appendChild(pokemonHeightRowValue);
                pokemonTableBody.appendChild(pokemonHeightRow);
                pokemonTable.appendChild(pokemonTableBody);
                _pokemonDialog.appendChild(pokemonTable);
                document.body.style.overflow = 'hidden';
                _pokemonDialog.showModal();
            });
        } else {
            throw new Error("You can only show details for objects of the Pokemon class");
        }
    }

    /**
     * This function fetches a list of all Pokemon from the pokeapi.co API and adds their names and URLs to the pokemon repository.
     * @returns a promise that resolves to the data fetched from the pokeapi.co API
     */
    async function loadList() {
        return fetch(new Request("https://pokeapi.co/api/v2/pokemon?limit=1302&offset=0")).then((response) => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        }).then((data) => {
            data.results.forEach((pokemonData) => {
                add(new Pokemon(pokemonData.name, null, null, null, pokemonData.url));
            });
            return data;
        });
    }

    /**
     * This function requests details for a Pokemon object from the pokeapi.co API and then stores the details in the pokemon repository.
     * @param {Pokemon} pokemon 
     * @returns a promise that resolves to the pokemon object with the details loaded
     */
    async function loadDetails(pokemon) {
        if (!(pokemon instanceof Pokemon)) {
            throw new Error("You can only fetch details for objects of the Pokemon class");
        }
        return fetch(new Request(pokemon.url)).then((response) => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        }).then((data) => {
            pokemon.imageLink = data.sprites.front_default;
            pokemon.height = data.height;
            pokemon.types = data.types.map((type) => type.type.name);
            return pokemon;
        });
    }

    /**
     * 
     * @returns an array of all pokemon
     */
    function getAll() {
        return _pokemonList;
    }

    /* Return the pokemon repositories public stuff. */
    return {
        Pokemon: Pokemon,
        add: add,
        getAll: getAll,
        searchByName: searchByName,
        addListItem: addListItem,
        openDetailsModal: openDetailsModal, //this is the equivalent of the showDetails function from the exercise
        closeDetailsModal: () => _pokemonDialog.close(),
        loadList: loadList,
        loadDetails: loadDetails
    };
})();

pokemonRepository.loadList().then(() => {
    pokemonRepository.getAll().forEach((pokemon) => {
        pokemonRepository.addListItem(pokemon);
    });
});