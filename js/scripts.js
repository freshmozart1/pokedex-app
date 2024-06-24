jQuery(() => {
  /**
   * This class represents a Pokemon.
   */
  class Pokemon {
    /**
     * @param {string} name The name of the Pokemon
     * @param {string} imageLink A URL that points to an image of the Pokemon
     * @param {number} height The height of the Pokemon
     * @param {string[]} types The types of the Pokemon
     */
    constructor(name, imageLink, height, types) {
      this.name = name;
      this.imageLink = imageLink;
      this.height = height;
      this.types = types;
    }

    /**
     * This method sets the content of the Pokémon modal.
     */
    #setModalContent() {
      $("#pokemon_modal div.modal-content")
        .empty()
        .append(
          $('<div class="modal-header"></div>').append(
            '<h5 class="modal-title">' + this.name + "</h5>",
            '<button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close">&#x2715;</button>'
          ),
          $('<div class="modal-body"></div>').append(
            '<img alt="' + this.name + '" src="' + this.imageLink + '">',
            "<p>Height: " + this.height + "</p>",
            "<p>Types: " + this.types.join(", ") + "</p>"
          )
        );
    }

    /**
     * This method adds the Pokémon to the DOM.
     */
    addToDOM() {
      const cardButton = $(
        '<button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#pokemon_modal">' +
          this.name +
          "</button>"
      );
      cardButton.on("click", () => this.#setModalContent());
      $("#pokemonContainer").append(
        $('<div class="col pt-3"></div>').append(
          $('<div class="card border-0"></div>').append(
            $(
              '<img class="card-img" alt="' +
                this.name +
                '" src="' +
                this.imageLink +
                '">'
            ),
            $('<div class="card-body text-center"></div>').append(cardButton)
          )
        )
      );
    }
  }

  // Fetch the data from the API and create Pokémon objects
  fetch("https://pokeapi.co/api/v2/pokemon?limit=151").then((response1) => {
    if (!response1.ok) {
      throw new Error("HTTP error " + response1.status);
    } else {
      response1.json().then((response1Json) => {
        response1Json.results.forEach((response1Data) => {
          fetch(response1Data.url).then((response2) => {
            if (!response2.ok) {
              throw new Error("HTTP error " + response2.status);
            } else {
              response2.json().then((response2Json) => {
                new Pokemon(
                  response2Json.name.charAt(0).toUpperCase() +
                    response2Json.name.slice(1),
                  response2Json.sprites.other["official-artwork"].front_default,
                  response2Json.height,
                  response2Json.types.map((type) => type.type.name)
                ).addToDOM();
              });
            }
          });
        });
      });
    }
  });
});
