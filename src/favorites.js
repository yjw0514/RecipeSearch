import { recipeList } from './main.js';

// 즐겨찾기
const favoritesBtn = document.querySelector('.likeBtn');
const favoritesList = document.querySelector('.like__list');
const favoritesRecipe = document.querySelector('.like__items');
const closeBtn = document.querySelector('.closeBtn');
const noFavorites = document.querySelector('.nofavorites');
let savedFavoritesList = [];

export function init() {
  //   console.log('init');
  savedFavoritesList = JSON.parse(localStorage.getItem('allRecipes'));
  if (savedFavoritesList == null) savedFavoritesList = [];
  if (savedFavoritesList === null || savedFavoritesList.length === 0) {
    noFavorites.classList.remove('invisible');
  } else {
    noFavorites.classList.add('invisible');
  }
}

// 즐겨찾기 목록 열기 &닫기
favoritesBtn.addEventListener('click', () => {
  favoritesList.classList.add('show');
  loadRecipe();
});

closeBtn.addEventListener('click', () => {
  favoritesList.classList.remove('show');
});

// removeItem from localstorage
function deleteRecipe(e, recipe) {
  // savedFavoritesList = JSON.parse(localStorage.getItem('allRecipes'));
  let li = recipeList.childNodes;
  if (li.length > 1) {
    li.forEach((el) => {
      if (el.dataset.label === recipe.label) {
        el.lastChild.classList.remove('active');
      }
    });
  }

  const cleanRecipe = savedFavoritesList.filter((el) => {
    return el.label !== recipe.label;
  });
  savedFavoritesList = cleanRecipe;

  localStorage.setItem('allRecipes', JSON.stringify(savedFavoritesList));
  if (savedFavoritesList === null || savedFavoritesList.length === 0) {
    noFavorites.classList.remove('invisible');
  } else {
    noFavorites.classList.add('invisible');
  }
  loadRecipe(savedFavoritesList);
}

// setItem in localstorage
export function saveRecipeList(e, recipe) {
  // savedFavoritesList = JSON.parse(localStorage.getItem('allRecipes'));
  if (savedFavoritesList == null) savedFavoritesList = [];

  let setRecipe = {
    label: recipe.label,
    image: recipe.image,
    link: recipe.url,
  };

  e.target.classList.add('active');
  savedFavoritesList.push(setRecipe);
  localStorage.setItem('allRecipes', JSON.stringify(savedFavoritesList));
  loadRecipe(setRecipe);

  if (savedFavoritesList === null || savedFavoritesList.length === 0) {
    noFavorites.classList.remove('invisible');
  } else {
    noFavorites.classList.add('invisible');
  }
}

// getItem from localstorage
function loadRecipe(addRecipe) {
  // if (addRecipe) {
  //   paintFavorites(addRecipe);
  // } else {
  favoritesRecipe.innerHTML = '';
  savedFavoritesList = JSON.parse(localStorage.getItem('allRecipes'));

  savedFavoritesList.forEach((el) => {
    paintFavorites(el);
  });
  // }
}

function paintFavorites(recipe) {
  const deleteBtn = document.createElement('button');
  const li = document.createElement('li');

  li.classList.add('like__list__item');
  deleteBtn.classList.add('deleteBtn');
  deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
      </svg>
    `;
  li.innerHTML = `
    <a class="linkBtn" target="_blank" href=${recipe.link}>
      <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/>
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
      </svg>
    </a>
    <img src=${recipe.image} alt="recipe">
    <p>${recipe.label}</p>
    `;

  li.append(deleteBtn);
  favoritesRecipe.append(li);

  deleteBtn.addEventListener('click', (e) => {
    const btn = e.target;
    const list = btn.parentNode;
    favoritesRecipe.removeChild(list);
    deleteRecipe(e, recipe);
  });
}

export {
  favoritesBtn,
  favoritesList,
  favoritesRecipe,
  closeBtn,
  noFavorites,
  savedFavoritesList,
};
