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
for (let i = 0; i < pokemonList.length; i++) {
    let text = `${pokemonList[i].name} (height: ${pokemonList[i].height})${pokemonList[i].height > 10 ? " - Wow, that's big!" : ""}<br />`;
    document.write(text);
}