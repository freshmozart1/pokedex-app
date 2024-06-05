const pokemonRepository = (() => {
    function Pokemon(name, height, types) {
        this.name = name;
        this.height = height;
        this.types = types;
    }

    let pokemonList = [
        new Pokemon("Bulbasaur", 7, ["grass", "poison"]),
        new Pokemon("Charizard", 17, ["fire", "flying"]),
        new Pokemon("Pikachu", 4, ["electric"])
    ];
    /*let pokemonList = [
        {
            name: "Bulbasaur",
            height: 7,
            types: ["grass", "poison"]
        },
        {
            name: "Charizard",
            height: 17,
            types: ["fire", "flying"]
        },
        {
            name: "Pikachu",
            height: 4,
            types: ["electric"]
        }
    ];*/

    function add(pokemon) {
        /*I think instanceof has the same functionality as typeof === 'object' and iterating over Object.keys()*/
        pokemon instanceof Pokemon ? pokemonList.push(pokemon) : console.error("You can only add objects of the Pokemon class");
    }

    function searchByName(pokemonName) {
        if (typeof pokemonName === "string") {
            return pokemonList.filter((pokemon) => pokemon.name === pokemonName);
        } else {
            console.error("The name of the Pokemon must be a string");
            return null;
        }
    }

    function getAll() {
        return pokemonList;
    }

    return {
        Pokemon: Pokemon,
        add: add,
        getAll: getAll,
        searchByName: searchByName
    };
})();

pokemonRepository.getAll().forEach((pokemon) => {
    let text = `${pokemon.name} (height: ${pokemon.height})${pokemon.height > 10 ? " - Wow, that's big!" : ""}<br />`;
    document.write(text);
});

pokemonRepository.add({}); /*This line generates an error because only objects from the Pokemon instance can be added to the repository.*/
pokemonRepository.searchByName(1); /*This line generates an error because the name of the Pokemon must be a string.*/