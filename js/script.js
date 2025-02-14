// Type colors mapping
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

// DOM Elements
const pokemonGrid = document.getElementById('pokemonGrid');
const loading = document.getElementById('loading');
const modal = document.getElementById('pokemonModal');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const themeToggle = document.querySelector('.theme-toggle');
const scrollTopButton = document.querySelector('.scroll-top');

// State
let allPokemon = [];
let filteredPokemon = [];

// Theme Management
const isDarkMode = localStorage.getItem('theme') === 'dark' ||
  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

if (isDarkMode) {
  document.documentElement.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', 
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
});

// Fetch Pokemon Data
async function fetchPokemon() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
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
}

// Render Pokemon Cards
function renderPokemonCards(pokemon) {
  pokemonGrid.innerHTML = pokemon.map(poke => `
    <div class="pokemon-card" data-id="${poke.id}">
      <div class="pokemon-image-container">
        <span class="pokemon-number">#${String(poke.id).padStart(3, '0')}</span>
        <img
          src="${poke.sprites.other['official-artwork'].front_default}"
          alt="${poke.name}"
          class="pokemon-image"
          loading="lazy"
        >
      </div>
      <div class="pokemon-info">
        <h2 class="pokemon-name">${poke.name}</h2>
        <div class="pokemon-types">
          ${poke.types.map(({ type }) => `
            <span class="type-badge" style="background-color: ${typeColors[type.name]}">
              ${type.name}
            </span>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');

  // Add click listeners to cards
  document.querySelectorAll('.pokemon-card').forEach(card => {
    card.addEventListener('click', () => {
      const pokemon = allPokemon.find(p => p.id === parseInt(card.dataset.id));
      showPokemonModal(pokemon);
    });
  });
}

// Show Pokemon Modal
function showPokemonModal(pokemon) {
  const modalBody = modal.querySelector('.modal-body');
  modalBody.innerHTML = `
    <div class="pokemon-modal-content">
      <div class="modal-image-container">
        <img
          src="${pokemon.sprites.other['official-artwork'].front_default}"
          alt="${pokemon.name}"
          class="modal-image"
        >
      </div>
      <div class="modal-info">
        <div class="modal-header">
          <h2 class="modal-name">${pokemon.name}</h2>
          <span class="modal-number">#${String(pokemon.id).padStart(3, '0')}</span>
        </div>

        <div class="pokemon-types">
          ${pokemon.types.map(({ type }) => `
            <span class="type-badge" style="background-color: ${typeColors[type.name]}">
              ${type.name}
            </span>
          `).join('')}
        </div>

        <div class="stats-container">
          <h3 class="stats-title">Stats</h3>
          ${pokemon.stats.map(({ base_stat, stat }) => `
            <div class="stat-row">
              <span class="stat-name">${stat.name.replace('-', ' ')}</span>
              <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${(base_stat / 255) * 100}%"></div>
              </div>
              <span class="stat-value">${base_stat}</span>
            </div>
          `).join('')}
        </div>

        <div class="abilities-container">
          <h3 class="abilities-title">Abilities</h3>
          <div class="abilities-list">
            ${pokemon.abilities.map(({ ability }) => `
              <span class="ability-badge">
                ${ability.name.replace('-', ' ')}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

// Close Modal
function closeModal() {
  modal.classList.remove('active');
}

// Search Pokemon
function searchPokemon(query) {
  const searchTerm = query.toLowerCase();
  filteredPokemon = allPokemon.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchTerm) ||
    String(pokemon.id).includes(searchTerm)
  );
  renderPokemonCards(filteredPokemon);
}

// Event Listeners
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  searchPokemon(searchInput.value);
});

searchInput.addEventListener('input', (e) => {
  searchPokemon(e.target.value);
});

modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
modal.querySelector('.modal-close').addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

scrollTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Initialize
fetchPokemon();