jQuery(function () {
    /**
     * This is a module that represents a Pokemon repository.
     */
    const pokemonRepository = (function () {

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
        let _pokemonDialog = $("#pokemon-dialog");

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
                const pokemonList = $(".pokemon-list");
                const listItem = $("<li></li>");
                const button = $("<button></button>").text(pokemon.name);
                button.on("click", () => openDetailsModal(pokemon));
                button.addClass("pokemon-button");
                listItem.append(button);
                pokemonList.append(listItem);
            } else {
                throw new Error("You can only add objects of the Pokemon class");
            }
        }

        /**
         * This function opens a modal in the browser window that shows the details of a Pokemon object.
         * @param {*} pokemon The Pokemon object whose details are to be shown.
         */
        function openDetailsModal(pokemon) {
            if (pokemon instanceof Pokemon) {
                loadDetails(pokemon).then(() => {
                    _pokemonDialog.empty();
                    /*I need the shitSolutionButton to prevent autofocus on 
                    the close button after the user opened the modal, because
                    I think the blue outline that Safari adds to the close button
                    looks ugly.*/
                    let shitSolutionButton = $("<button></button>").css({
                        width: '0',
                        height: '0',
                        padding: '0',
                        margin: '0',
                        border: '0',
                        outline: '0'
                    });
                    let closeButton = $("<button></button>").attr({
                        'aria-label': 'Close',
                        id: 'close-info-modal'
                    }).html('&#10006;');
                    closeButton.on('click', () => {
                        $("body").css("overflow", "auto");
                        closeDetailsModal();
                    });
                    let pokemonImage = $("<img>").attr({
                        src: pokemon.imageLink,
                        alt: pokemon.name
                    });
                    let pokemonTable = $("<table></table>");
                    pokemonTable.append(
                        $("<thead></thead>").append($("<tr></tr>")
                            .append($("<th></th>").text(pokemon.name))
                        ),
                        $("<tbody></tbody>").append($("<tr></tr>")
                            .append($("<td></td>").text('Height'), $("<td></td>").text(pokemon.height))
                        )
                    );
                    _pokemonDialog.append(shitSolutionButton, closeButton, pokemonImage, pokemonTable);
                    $("body").css("overflow", "hidden");
                    _pokemonDialog[0].showModal();// [0] is used to access the DOM element from the jQuery object, because showModal is a DOM method
                });
            } else {
                throw new Error("You can only show details for objects of the Pokemon class");
            }
        }

        /**
         * This function closes the modal that shows the details of a Pokemon object.
         */
        function closeDetailsModal() {
            _pokemonDialog[0].close();// [0] is used to access the DOM element from the jQuery object, because close is a DOM method
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
            closeDetailsModal: closeDetailsModal,
            loadList: loadList,
            loadDetails: loadDetails
        };
    })();

    pokemonRepository.loadList().then(() => {
        pokemonRepository.getAll().forEach((pokemon) => {
            pokemonRepository.addListItem(pokemon);
        });
    });
});