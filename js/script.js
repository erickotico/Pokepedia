// Mapeamento de cores para tipos de pokemon
const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dark: '#705848',
    dragon: '#7038F8',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  };
  
  // Estado
  let allPokemon = [];
  let filteredPokemon = [];
  
  // Busca os dados do pokemon
  async function fetchPokemon() {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
      const data = await response.json();
      
      const pokemonDetails = await Promise.all(
        data.results.map(async pokemon => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );
      allPokemon = pokemonDetails;
      filteredPokemon = pokemonDetails;
      renderPokemonCards(pokemonDetails);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      pokemonGrid.innerHTML = '<p class="error">Error loading Pokemon. Please try again later.</p>';
    } finally {
      loading.style.display = 'none';
    }
console.log()  
}
