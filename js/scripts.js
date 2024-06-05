let pokemonList = [
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
];

pokemonList.forEach((pokemon) => {
    let text = `${pokemon.name} (height: ${pokemon.height})${pokemon.height > 10 ? " - Wow, that's big!" : ""}<br />`;
    document.write(text);
});