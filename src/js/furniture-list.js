import axios from 'axios';

const BASE_URL = 'https://furniture-store-v2.b.goit.study/api';

// DOM
const els = {
  categories: document.querySelector('.furniture-categories__list'),
  products: document.querySelector('.products-grid.furniture-list-js'),
  more: document.querySelector('.furniture__load-more'),
};

// Мапа модифікаторів на назви з БД
const MOD_TO_NAME = {
  soft: "М'які меблі",
  wardrobes: 'Шафи та системи зберігання',
  beds: 'Ліжка та матраци',
  tables: 'Столи',
  chairs: 'Стільці та табурети',
  kitchens: 'Кухні',
  kids: 'Меблі для дитячої',
  office: 'Меблі для офісу',
  hallway: 'Меблі для передпокою',
  bathroom: 'Меблі для ванної кімнати',
  outdoor: 'Садові та вуличні меблі',
  decor: 'Декор та аксесуари',
};

// State
let state = { categoryId: '', page: 1, limit: 8, total: 0 };

// API
const getCategories = () =>
  axios.get(`${BASE_URL}/categories`).then(r => r.data);

const getFurnitures = () =>
  axios
    .get(`${BASE_URL}/furnitures`, {
      params: {
        page: state.page,
        limit: state.limit,
        ...(state.categoryId ? { category: state.categoryId } : {}), // ← ключ "category"
      },
    })
    .then(r => r.data); // { furnitures, totalItems, ... }

// Helpers
const priceUA = v => new Intl.NumberFormat('uk-UA').format(v) + ' грн';
const colors = a =>
  (a || [])
    .slice(0, 3)
    .map(c => `<li class="color-dot" style="background:${c}"></li>`)
    .join('');
const card = ({ _id, name, images = [], price, color = [] }) => `
<li class="product-card" data-id="${_id}">
  <div class="product-card__media">
    <img class="product-card__img" src="${
      images[0] || ''
    }" alt="${name}" loading="lazy">
  </div>
  <div class="product-card__body">
    <h3 class="product-card__title" title="${name}">${name}</h3>
    <ul class="product-card__colors">${colors(color)}</ul>
    <p class="product-card__price">${priceUA(price)}</p>
    <button class="product-card__btn" type="button">Детальніше</button>
  </div>
</li>`;

// Рендер категорій (підпис + data-id)
async function renderCategories() {
  const map = Object.fromEntries(
    (await getCategories()).map(c => [c.name, c._id])
  );

  els.categories.querySelectorAll('.category-chip').forEach(btn => {
    if (btn.classList.contains('category-chip--all')) return;
    const mod = [...btn.classList]
      .find(c => c.startsWith('category-chip--'))
      .replace('category-chip--', '');
    const name = MOD_TO_NAME[mod];
    btn.querySelector('.furniture-categories__js').textContent = name;
    btn.dataset.categoryId = map[name] || '';
  });
}

// Рендер товарів (replace=true — замінити, false — додати)
async function renderProducts(replace = true) {
  const { furnitures, totalItems } = await getFurnitures();
  state.total = totalItems;

  const html = furnitures.map(card).join('');
  replace
    ? (els.products.innerHTML = html)
    : els.products.insertAdjacentHTML('beforeend', html);

  const shown = els.products.children.length;
  els.more.style.display = shown < state.total ? '' : 'none';
}

// Події
els.categories.addEventListener('click', e => {
  const btn = e.target.closest('.category-chip');
  if (!btn) return;

  els.categories
    .querySelectorAll('.active-frame')
    .forEach(b => b.classList.remove('active-frame'));
  btn.classList.add('active-frame');

  state.categoryId = btn.dataset.categoryId || ''; // "" = всі товари
  state.page = 1;
  renderProducts(true);
});

els.more.addEventListener('click', () => {
  state.page += 1;
  renderProducts(false);
});

// Init
(async function init() {
  await renderCategories();
  await renderProducts(true); // стартові 8 карток
})();
