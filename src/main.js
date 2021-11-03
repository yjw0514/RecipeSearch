import { APP_ID, APP_KEY, DATAPERPAGE, PAGECOUNT } from './config.js';

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
function getRecipe(searchword) {
  loadingShow();
  axios
    .get('https://api.edamam.com/search?', {
      params: {
        q: pageState.searchword,
        from: (pageState.currentPage - 1) * pageState.dataPerPage,
        to: pageState.currentPage * pageState.dataPerPage,
        app_id: APP_ID,
        app_key: APP_KEY,
      },
      Headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    .then((response) => {
      // console.log(response.data.hits);
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
    recipeSaveBtn.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 0 24 24" width="28px" >
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>`;
    recipeCard.append(recipeSaveBtn);
    recipeList.append(recipeCard);

    recipeSaveBtn.addEventListener('click', (e) => {
      saveRecipeList(e, data);
    });
  });

  scrollToResultPage();
  loadingHidden();
  renderPaging();
}

// 즐겨찾기
const favoritesBtn = document.querySelector('.likeBtn');
const favoritesList = document.querySelector('.like__list');
const favoritesRecipe = document.querySelector('.like__items');
const closeBtn = document.querySelector('.closeBtn');

// 즐겨찾기 목록 열기 &닫기
favoritesBtn.addEventListener('click', () => {
  favoritesList.classList.add('show');
  loadRecipe();
});

closeBtn.addEventListener('click', () => {
  favoritesList.classList.remove('show');
});

let savedFavoritesList = [];

// removeItem from localstorage
function deleteRecipe(e, recipe) {
  const btn = e.target;
  const list = btn.parentNode;
  favoritesRecipe.removeChild(list);
  const cleanRecipe = savedFavoritesList.filter((el) => {
    return el.name !== recipe.name;
  });
  savedFavoritesList = cleanRecipe;
  localStorage.setItem('allRecipes', JSON.stringify(savedFavoritesList));
}

// setItem in localstorage
function saveRecipeList(e, recipe) {
  savedFavoritesList = JSON.parse(localStorage.getItem('allRecipes'));
  if (savedFavoritesList == null) savedFavoritesList = [];

  let favoritesName = recipe.label;
  let favoritesImg = recipe.image;
  let favoritesLink = recipe.url;

  let setRecipe = {
    name: favoritesName,
    image: favoritesImg,
    link: favoritesLink,
  };

  e.target.classList.add('active');
  localStorage.setItem('setRecipe', JSON.stringify(setRecipe));
  savedFavoritesList.push(setRecipe);
  localStorage.setItem('allRecipes', JSON.stringify(savedFavoritesList));

  loadRecipe(setRecipe);
}

function loadRecipe(addRecipe) {
  if (addRecipe) {
    paintFavorites(addRecipe);
  } else {
    savedFavoritesList = JSON.parse(localStorage.getItem('allRecipes'));
    if (savedFavoritesList === null) {
      return (favoritesRecipe.innerHTML = '없습니다.');
    }
    savedFavoritesList.forEach((el) => {
      paintFavorites(el);
    });
  }
}

// getItem from localstorage
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
  <p>${recipe.name}</p>
  `;

  li.append(deleteBtn);
  favoritesRecipe.append(li);
  deleteBtn.addEventListener('click', (e) => deleteRecipe(e, recipe));
}

function scrollToResultPage() {
  resultPage.classList.remove('invisible');
  const location = resultPage.offsetTop;
  window.scrollTo({ top: location, behavior: 'smooth' });
}

// Pagination

function paging(totalData, dataPerPage, pageCount, currentPage) {
  let totalPageCount = Math.ceil(totalData / dataPerPage);
  pageState.totalPageCount = totalPageCount;

  let firstPageNumber = '';
  let lastPageNumber = '';
  if (currentPage % pageCount === 0) {
    // 5의 배수인 경우(pageCount의 배수일 때)
    firstPageNumber = currentPage - dataPerPage;
    lastPageNumber = currentPage;
  } else {
    firstPageNumber = currentPage - (currentPage % pageCount) + 1;
    lastPageNumber = currentPage - (currentPage % pageCount) + pageCount;
  }

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
    pages.append(pageNumber);
    pageNumber.addEventListener('click', changeCurrentPage);
  }
  const page = document.querySelectorAll('.page');
  page.forEach((el) => {
    if (+el.dataset.page === pageState.currentPage) {
      el.style.backgroundColor = 'rgb(255, 213, 107)';
    }
  });

  //prev버튼(현재 페이지가 5페이지 이하면 숨기기, 6-10페이지 일때부터 나타남)
  if (pageState.currentPage <= pageState.pageCount) {
    prevBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'flex';
  }

  //next 버튼(totalData가 20개 이하면 숨기기)
  if (
    pageState.totalData <= pageState.dataPerPage * pageState.pageCount ||
    pageState.currentPage + pageState.pageCount > pageState.totalPageCount
  ) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'flex';
  }
}

// page버튼 클릭하면 실행
function changeCurrentPage(e) {
  pageState.currentPage = +e.target.dataset.page;
  getRecipe();
}

// prev버튼 클릭 이벤트
const prevBtn = document.querySelector('.prev');
prevBtn.addEventListener('click', () => {
  if (pageState.currentPage % pageState.pageCount === 0) {
    pageState.currentPage =
      (Math.floor(pageState.currentPage / pageState.pageCount) - 1) *
        pageState.pageCount -
      pageState.dataPerPage;
  } else {
    pageState.currentPage =
      Math.floor(pageState.currentPage / pageState.pageCount) *
        pageState.pageCount -
      pageState.dataPerPage;
  }

  if (pageState.currentPage <= pageState.pageCount) {
    prevBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'flex';
  }

  getRecipe();
});

// next버튼 클릭 이벤트
const nextBtn = document.querySelector('.next');
nextBtn.addEventListener('click', () => {
  if (pageState.currentPage % pageState.pageCount === 0) {
    pageState.currentPage =
      Math.ceil(pageState.currentPage / pageState.pageCount) *
        pageState.pageCount +
      pageState.pageCount;
  } else {
    pageState.currentPage =
      (Math.floor(pageState.currentPage / pageState.pageCount) + 1) *
        pageState.pageCount +
      pageState.pageCount;
  }

  if (pageState.currentPage + pageState.pageCount > pageState.totalPageCount) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'flex';
  }

  getRecipe();
});

// loadingBar
const loadingImg = document.querySelector('.load__img');
function loadingShow() {
  loadingImg.style.display = 'block';
}
function loadingHidden() {
  loadingImg.style.display = 'none';
}

window.onload = loadingHidden();
