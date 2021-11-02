import { APP_ID, APP_KEY, DATAPERPAGE, PAGECOUNT } from './config.js';

const searchInput = document.querySelector('.search__input');
const searchBtn = document.querySelector('.searchBtn');
const recipeList = document.querySelector('.recipe__list');
const resultPage = document.getElementById('result');
const pages = document.getElementById('pages');
const pageBtn = document.querySelectorAll('.page');
const recipeBtn = document.querySelectorAll('.recipe__btn');
const tagButtons = document.querySelector('.search__tag');
const pagination = document.querySelector('.pagination');
let searchedRecipe = [];

let pageState = {
  searchword: '',
  currentPage: 1,
  totalData: 0,
  pageCount: PAGECOUNT,
  dataPerPage: DATAPERPAGE,
  totalPageCount: 0,
};

//tagBtn 클릭
tagButtons.addEventListener('click', (e) => {
  pageState.currentPage = 1;
  pageState.searchword = e.target.dataset.value;
  if (e.target.dataset.value == null) return;
  getRecipe(e.target.dataset.value);
});

// searching
searchBtn.addEventListener('click', () => {
  pageState.currentPage = 1;

  pageState.searchword = searchInput.value;
  getRecipe(searchInput.value);
});

searchInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    pageState.currentPage = 1;
    pageState.searchword = e.target.value;
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
  console.log(pageState.currentPage);
  axios
    .get('https://api.edamam.com/search?', {
      params: {
        q: pageState.searchword,
        from: (pageState.currentPage - 1) * pageState.dataPerPage,
        to: pageState.currentPage * pageState.dataPerPage,
        app_id: APP_ID,
        app_key: APP_KEY,
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
      } else {
        renderRecipe(recipeData);
        pagination.style.display = 'flex';
      }

      resultPage.classList.remove('invisible');
      const location = resultPage.offsetTop;
      window.scrollTo({ top: location, behavior: 'smooth' });
    })
    .catch((error) => console.error(error));
}

function renderRecipe(recipeData) {
  let html = '';
  recipeData.forEach((recipe) => {
    const data = recipe.recipe;
    html += `<li class="recipe__card">
      <div class="recipe__card__inner">
      <img src=${data.image} alt="food" />
      <h3>${data.label}</h3>
      <p>${Math.floor(data.calories)}kcal</p>
      <button class="recipe__btn">Get Recipe</button>
      </div>
      </li>`;
  });

  recipeList.innerHTML = html;
  resultPage.classList.remove('invisible');
  const location = resultPage.offsetTop;
  window.scrollTo({ top: location, behavior: 'smooth' });

  renderPaging();
}

// Pagination

function paging(totalData, dataPerPage, pageCount, currentPage) {
  let totalPageCount = Math.ceil(totalData / dataPerPage);
  pageState.totalPageCount = totalPageCount;
  let firstPageNumber = currentPage - (currentPage % pageCount) + 1;
  let lastPageNumber = currentPage - (currentPage % pageCount) + pageCount;
  if (lastPageNumber > totalPageCount) lastPageNumber = totalPageCount;
  return {
    firstPageNumber,
    lastPageNumber,
  };
}

function renderPaging() {
  const pages = document.querySelector('#pages');
  pages.innerHTML = '';
  const { firstPageNumber, lastPageNumber } = paging(
    pageState.totalData,
    pageState.dataPerPage,
    pageState.pageCount,
    pageState.currentPage
  );

  for (let i = firstPageNumber; i <= lastPageNumber; i++) {
    const pageNumber = document.createElement('li');
    pageNumber.classList.add('page');
    pageNumber.innerHTML = i;
    pageNumber.dataset.page = i;
    pageNumber.addEventListener('click', changeCurrentPage);
    pages.append(pageNumber);
  }

  if (pageState.currentPage < pageState.pageCount) {
    prevBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'flex';
  }

  if (pageState.totalData <= pageState.dataPerPage) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'flex';
  }
}

function changeCurrentPage(e) {
  pageState.currentPage = +e.target.dataset.page;
  getRecipe();
}

// prev, next Btn
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
prevBtn.addEventListener('click', () => {
  pageState.currentPage =
    (Math.floor(pageState.currentPage / pageState.pageCount) - 1) *
      pageState.pageCount +
    1;

  if (pageState.currentPage < pageState.pageCount) {
    // prevBtn.classList.add('invisible');
    prevBtn.style.display = 'none';
  } else {
    // prevBtn.classList.remove('invisible');
    prevBtn.style.display = 'block';
  }
  console.log(pageState.currentPage);

  getRecipe();
});

nextBtn.addEventListener('click', () => {
  pageState.currentPage =
    Math.ceil(pageState.currentPage / pageState.pageCount) *
      pageState.pageCount +
    1;

  if (pageState.currentPage + pageState.pageCount > pageState.totalPageCount) {
    // nextBtn.classList.add('invisible');
    nextBtn.style.display = 'none';
  } else {
    // nextBtn.classList.remove('invisible');
    nextBtn.style.display = 'block';
  }
  console.log(pageState.currentPage);
  getRecipe();
});

// card 클릭하면 레시피 모달 창
const getRecipeBtn = document.querySelector('.recipe__btn');
recipeList.addEventListener('click', (e) => {
  console.log(e);
});
