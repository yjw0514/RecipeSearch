import { APP_ID, APP_KEY } from './config';

const searchInput = document.querySelector('.search__input');
const searchBtn = document.querySelector('.searchBtn');
const recipeList = document.querySelector('.recipe__list');
const resultPage = document.getElementById('result');
const pages = document.getElementById('pages');
const pageBtn = document.querySelectorAll('.page');
const recipeBtn = document.querySelectorAll('.recipe__btn');
const tagButtons = document.querySelector('.search__tag');
let searchedRecipe = [];
let recipePerPage = [];
let recipeCard = [];

//tagBtn 클릭
tagButtons.addEventListener('click', (e, el) => {
  const value = e.target.dataset.value;
  if (value == null) return;
  getRecipe(e.target.dataset.value);
});

// searching
searchBtn.addEventListener('click', () => {
  getRecipe(searchInput.value);
});

searchInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    getRecipe(e.target.value);
  }
});

// scroll down 버튼
const downBtn = document.querySelector('.arrow__down');
if (searchedRecipe.length === 0) {
  downBtn.classList.add('invisible');
} else {
  downBtn.classList.remove('invisible');
}
downBtn.addEventListener('click', () => {
  const location = resultPage.offsetTop;
  window.scrollTo({ top: location, behavior: 'smooth' });
});

// scroll up 버튼
const topBtn = document.querySelector('.arrow__up');
topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// get recipe
function getRecipe(searchword) {
  axios
    .get('https://api.edamam.com/search?', {
      params: {
        q: searchword,
        to: 20,
        app_id: APP_ID,
        app_key: APP_KEY,
      },
    })
    .then((response) => {
      searchInput.value = '';
      searchedRecipe = [];
      recipePerPage = [];
      pages.innerHTML = '';
      recipeList.innerHTML = '';
      console.log(response.data);
      let recipeData = response.data.hits;
      console.log(recipeData);
      if (recipeData.length == 0) {
        recipeList.innerHTML = `<h2 class="no__result">Sorry, we didn't find any Recipe!</h2>`;
      } else {
        renderRecipe(recipeData);
      }

      resultPage.classList.remove('invisible');
      const location = resultPage.offsetTop;
      window.scrollTo({ top: location, behavior: 'smooth' });
    })
    .catch((error) => console.error(error));
}

function renderRecipe(recipeData) {
  recipeData.forEach((recipe) => {
    const data = recipe.recipe;
    searchedRecipe.push({ ...data });
  });
}

//   searchedRecipe.forEach((data) => {
//     recipeList.innerHTML += `
//       <li class="recipe__card">
//       <div class="recipe__card__inner">
//       <img src=${data.image} alt="food" />
//       <h3>${data.label}</h3>
//       <p>${Math.floor(data.calories)}kcal</p>
//       <button class="recipe__btn">Get Recipe</button>
//       </div>
//       </li>`;
//   });

// card 클릭하면 레시피 모달 창
const getRecipeBtn = document.querySelector('.recipe__btn');
recipeList.addEventListener('click', (e) => {
  console.log(e);
});
