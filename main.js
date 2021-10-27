const searchInput = document.querySelector('.search__input');
const recipeList = document.querySelector('.recipe__list');
const resultPage = document.getElementById('result');
const searchedRecipe = [];
if (searchedRecipe.length === 0) {
  resultPage.classList.add('invisible');
} else {
  resultPage.classList.remove('invisible');
}
console.log(searchedRecipe);
searchInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    getRecipe(e.target.value);
  }
});

function getRecipe(searchword) {
  axios
    .get('https://api.edamam.com/search?', {
      params: {
        q: searchword,
        app_id: '',
        app_key: '',
      },
      // headers: {
      //   'Access-Control-Allow-Origin': '*',
      //   'Access-Control-Allow-Methods':
      //     'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      //   'Access-Control-Allow-Headers':
      //     'Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length',
      // },
    })
    .then((response) => {
      searchRecipe(response.data.hits);
    })
    .catch((error) => console.error(error));
}

function createElement(recipe) {
  searchedRecipe.push(recipe);
  const data = recipe.recipe;
  // console.log(data);
  const li = document.createElement('li');
  li.setAttribute('class', 'recipe__card');
  li.innerHTML = `
            <div class="recipe__card__inner">
              <h3>${data.label}</h3>
              <img src=${data.image} alt="food" />
              <div class="recipe__card__content">
                <p>${data.totalTime}</p>
                <p>${data.calories}</p>
                <p>${data.ingredientLines}</p>
            </div>`;
  return li;
}

function searchRecipe(recipes) {
  const elements = recipes.map(createElement);
  const recipeList = document.querySelector('.recipe__list');
  recipeList.append(...elements);
}
