import { categories, courses } from './data.js';

const PAGE_SIZE = 9;

const state = {
  category: 'all',
  query: '',
  visible: PAGE_SIZE,
};

const refs = {
  tabs: document.querySelector('.tabs__list'),
  search: document.querySelector('.search__input'),
  grid: document.querySelector('.grid__list'),
  more: document.querySelector('.grid__more'),
  empty: document.querySelector('.grid__empty'),
};

function countFor(categoryId) {
  if (categoryId === 'all') return courses.length;
  return courses.filter((c) => c.category === categoryId).length;
}

const normalize = (str) => str.toLowerCase().trim();

function getFiltered() {
  const query = normalize(state.query);
  return courses.filter((course) => {
    const byCategory = state.category === 'all' || course.category === state.category;
    const byQuery = query === '' || normalize(course.title).includes(query);
    return byCategory && byQuery;
  });
}

/* --- Шаблоны --- */

function tabTemplate(category) {
  const isActive = category.id === state.category;
  const modifier = isActive ? ' tabs__button_active' : '';
  return `
    <li class="tabs__item">
      <button type="button"
              class="tabs__button${modifier}"
              data-category="${category.id}"
              aria-pressed="${isActive}">
        ${category.label}<sup class="tabs__count">${countFor(category.id)}</sup>
      </button>
    </li>
  `;
}

function cardTemplate(course) {
  const category = categories.find((c) => c.id === course.category);
  return `
    <article class="card">
      <div class="card__image-wrap">
        <img class="card__image" src="${course.image}" alt="" loading="lazy" width="390" height="240">
      </div>
      <div class="card__body">
        <span class="card__badge card__badge_${course.category}">${category.label}</span>
        <h3 class="card__title">${course.title}</h3>
        <div class="card__info">
          <span class="card__price">$${course.price}</span>
          <span class="card__divider" aria-hidden="true"></span>
          <span class="card__author">by ${course.author}</span>
        </div>
      </div>
    </article>
  `;
}

function renderTabs() {
  refs.tabs.innerHTML = categories.map(tabTemplate).join('');
}

function renderGrid() {
  const filtered = getFiltered();
  const shown = filtered.slice(0, state.visible);

  refs.grid.innerHTML = shown.map(cardTemplate).join('');

  const isEmpty = filtered.length === 0;
  refs.empty.hidden = !isEmpty;
  refs.grid.hidden = isEmpty;

  // Кнопку показываем, только если ещё есть что раскрыть.
  refs.more.hidden = filtered.length <= state.visible;
}

refs.tabs.addEventListener('click', (event) => {
  const button = event.target.closest('.tabs__button');
  if (!button) return;
  state.category = button.dataset.category;
  state.visible = PAGE_SIZE;
  renderTabs();
  renderGrid();
});

refs.search.addEventListener('input', (event) => {
  state.query = event.target.value;
  state.visible = PAGE_SIZE;
  renderGrid();
});

refs.more.addEventListener('click', () => {
  state.visible += PAGE_SIZE;
  renderGrid();
});

renderTabs();
renderGrid();
