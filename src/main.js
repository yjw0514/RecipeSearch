// import { APP_ID, APP_KEY, DATAPERPAGE, PAGECOUNT } from './config.js';
import {
  favoritesList,
  savedFavoritesList,
  init,
  saveRecipeList,
} from './favorites.js';
import { renderPaging } from './pagination.js';

const searchInput = document.querySelector('.search__input');
const searchBtn = document.querySelector('.searchBtn');
const recipeList = document.querySelector('.recipe__list');
const resultPage = document.getElementById('result');
const tagButtons = document.querySelector('.search__tag');
const pagination = document.querySelector('.pagination');
let pageState = {
  searchword: '',
  currentPage: 1,
  totalData: 0,
  pageCount: 5,
  dataPerPage: 4,
  // pageCount: PAGECOUNT,
  // dataPerPage: DATAPERPAGE,
  totalPageCount: 0,
};

// loadingBar
const loadingImg = document.querySelector('.load__img');
function loadingShow() {
  loadingImg.style.display = 'block';
}
function loadingHidden() {
  loadingImg.style.display = 'none';
}
window.onload = () => {
  loadingHidden();
  init();
};

//tagBtn 클릭
tagButtons.addEventListener('click', (e) => {
  pageState.currentPage = 1;
  pageState.searchword = e.target.dataset.value;
  if (e.target.dataset.value == null) return;
  getRecipe(e.target.dataset.value);
  favoritesList.classList.remove('show');
});

// searching
searchBtn.addEventListener('click', () => {
  pageState.currentPage = 1;
  pageState.searchword = searchInput.value;
  getRecipe(searchInput.value);
  favoritesList.classList.remove('show');
});

searchInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    pageState.currentPage = 1;
    pageState.searchword = e.target.value;
    getRecipe(e.target.value);
    favoritesList.classList.remove('show');
  }
});

// scroll down 버튼
const downBtn = document.querySelector('.arrow__down');
downBtn.addEventListener('click', () => {
  const location = resultPage.offsetTop;
  window.scrollTo({ top: location, behavior: 'smooth' });
});

// scroll up 버튼
const topBtn = document.querySelector('.arrow__up');
const homeBtn = document.querySelector('.homeBtn');
homeBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// get recipe
export function getRecipe(searchword) {
  loadingShow();
  axios
    .get('https://api.edamam.com/search?', {
      params: {
        q: pageState.searchword,
        from: (pageState.currentPage - 1) * pageState.dataPerPage,
        to: pageState.currentPage * pageState.dataPerPage,
        app_id: '4aa48406',
        app_key: '88c3b0f387487edd5dfc3eaee1562921',
        // app_id: APP_ID,
        // app_key: APP_KEY,
      },
      Headers: {
        'Access-Control-Allow-Origin': '*',
        'permissions-policy': 'interest-cohort=()',
      },
    })
    .then((response) => {
      searchInput.value = '';
      if (response.data.count > 100) {
        pageState.totalData = 100;
      } else {
        pageState.totalData = response.data.count;
      }

      let recipeData = response.data.hits;
      if (recipeData.length == 0) {
        recipeList.innerHTML = `<h2 class="no__result">Sorry, we didn't find any Recipe!</h2>`;
        pagination.style.display = 'none';
        scrollToResultPage();
      } else {
        renderRecipe(recipeData);
        pagination.style.display = 'flex';
      }

      if (!recipeData) {
        downBtn.style.display = 'none';
      } else {
        downBtn.style.display = 'block';
      }
    })
    .catch((error) => console.error(error));
}

function renderRecipe(recipeData) {
  recipeList.innerHTML = '';
  recipeData.forEach((recipe) => {
    const data = recipe.recipe;
    // recipeCard 생성
    const recipeCard = document.createElement('li');
    recipeCard.classList.add('recipe__card');
    recipeCard.dataset.label = data.label;
    recipeCard.innerHTML = `
    <div class="recipe__card__inner">
    <img src=${data.image} alt="food" />
      <h3>${data.label}</h3>
      <p>${Math.floor(data.calories)}kcal</p>
      <a class="recipe__btn" href="${data.url}"  target="_blank" >Get Recipe</a>
      </div>
      `;

    // recipeMarkBtn 생성
    const recipeSaveBtn = document.createElement('button');
    recipeSaveBtn.classList.add('recipe__mark');
    recipeSaveBtn.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" >
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>`;
    recipeCard.append(recipeSaveBtn);
    recipeList.append(recipeCard);
    if (savedFavoritesList.some((el) => el.label === data.label)) {
      recipeSaveBtn.classList.add('active');
    } else {
      recipeSaveBtn.classList.remove('active');
    }

    recipeSaveBtn.addEventListener('click', (e) => {
      if (savedFavoritesList.some((el) => el.label === data.label)) {
        recipeSaveBtn.classList.remove('active');
        deleteRecipe(e, data);
      } else {
        saveRecipeList(e, data);
      }
    });
  });

  scrollToResultPage();
  loadingHidden();
  renderPaging();
}

function scrollToResultPage() {
  resultPage.classList.remove('invisible');
  const location = resultPage.offsetTop;
  window.scrollTo({ top: location, behavior: 'smooth' });
  loadingHidden();
}

export {
  searchInput,
  searchBtn,
  recipeList,
  resultPage,
  tagButtons,
  pagination,
  pageState,
};
