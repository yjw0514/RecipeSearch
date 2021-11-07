import { pageState, getRecipe } from './main.js';

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

export function renderPaging() {
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
