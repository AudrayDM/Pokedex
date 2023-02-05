//Creating a pokemon respository in which the pokemon´s list is included
//The pokemonlist is an empty Array linked to the Pokemon API 
//This allows me to switch from the static list I made to A complete list of Pokemon e.g ApiUrl 

let PokemonRepository = (function () {
let PokemonList= [];
let ApiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'; 

let pokemonList = document.getElementById('pokemonList')

  function add (pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon
    ){
      PokemonList.push(pokemon);
    } else {
       console.log("pokemon is not correct");
      }
    }

    function getAll() {
      return pokemonList;
  }

  
function listPokemons(pokemons) {
  pokemonList.innerHTML = ""
  pokemons.forEach((pokemon) => addListItem (pokemon));
}


  function addListItem (pokemon) {
    let PokemonList = document.querySelector('.list-group');
    let ListPokemon = document.createElement('li');

    let Button = document.createElement('Button');
    Button.innerText = pokemon.name;
    //just added this to trigger the modal and it seems to work 
    Button.classList.add('list-group-item','list-group-item-action','text-center');
    Button.setAttribute('data-toggle', 'modal');
    Button.setAttribute('data-target', '#pokemonModal');
  
    Button.classList.add('btnbtn-primary');
    ListPokemon.classList.add('list-group-item');
    
    ListPokemon.appendChild(Button);
    PokemonList.appendChild(ListPokemon);  
    Button.addEventListener('click', function () {
    showDetails (pokemon); 
})
}

//Asnyc function using the fetch method to get pokemonlist from the "ApiUrl"
//result = response = promise= the Json function passed as a parameter of the fetch ()
  async function loadList() {
  try {
    const response = await fetch(ApiUrl);
    const json = await response.json();
    json.results.forEach(function (item) {
      let pokemon = {
      name: item.name,
      detailsUrl: item.url
      };
      add(pokemon);
    });
    listPokemons(PokemonList) 
  } catch (e) {
    console.error(e);
  }
}


  async function loadDetails(item) {
  let url = item.detailsUrl;
  try {
    const response = await fetch(url);
    const details = await response.json();

      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = [];
      for (let i = 0; i < details.types.length; i++) {
        item.types.push(details.types[i].type.name);
      }
      item.weight = details.weight;
      item.abilities = [];
      for (let i = 0; i < details.abilities.length; i++) {
        item.abilities.push(details.abilities[i].ability.name);
      }
  } catch (e) {
    console.error(e);
  }
}


function showDetails(item) {
   PokemonRepository.loadDetails(item).then(function () {
     showModal(item);
   });
 }

// trying to add a search function 
// This triggers the searchBar it doesnt work the way I want 
// e.g select and print on Dom once clicked enter?? :X

searchBar.addEventListener('keyup', (e) => {
  
  const searchString = e.target.value.toLowerCase();
  console.log(searchString)
  const filteredPokemons = PokemonList.filter((pokemon) => {
      return (
          pokemon.name.toLowerCase().includes(searchString) 
      );
  });
  listPokemons(filteredPokemons);
});


function showModal(item) { 
  let modalBody = $(".modal-body");
  let modalTitle = $(".modal-title");
    
  modalTitle.empty ();
  modalBody.empty ();
  
  let nameElement = $ ("<p> " + "Name : " + item.name + "</p> ");
  
  let imageElement = document.createElement('img');
  imageElement.setAttribute ("src", item.imageUrl);
  
  let heightElement = $ ("<p> " + "Height : " + item.height + "</p> ");
  let weightElement = $ ("<p> " + "Weight : " + item.weight + "</p> ");
  let typesElement = $ ("<p> " + "Types : " + item.types + "</p> ");
  let abilitiesElement = $ ("<p> " + "Abilities : " + item.abilities + "</p> ");
  
  modalTitle.append(nameElement);
  modalBody.append(imageElement);
  modalBody.append(heightElement);
  modalTitle.append(weightElement);
  modalBody.append(typesElement);
  modalBody.append(abilitiesElement);

}

  return {
    getAll: getAll,
    add: add,
    addListItem : addListItem,
    loadList : loadList,
    loadDetails : loadDetails,
    showDetails : showDetails,
    showModal : showModal 
  };
})(); 
// The code above is wrapped into an IIFE which protects your code and executes it automatically thanks to the ()
// while creating a function inside an IIFE remember to call it again in the return part of the function right before closing the function with extra ()
// this goes for all the previously created fucntion in the IFFE

PokemonRepository.loadList();

