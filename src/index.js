import 'modern-normalize';
import { fetchPhoto, DEFAULT_PAGE, resetPage } from './fetchPhoto';
import { DEFAULT_PAGE, DEFAULT_PERPAGE } from './fetchPhoto';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  showCounter: false,
  alertError: false,
  captionsData: 'alt',
});

const form = document.querySelector('.search-form');
const button = document.querySelector('form');
const cards = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
let inputValue = '';

button.addEventListener('submit', onFormSubmit);
loadMoreButton.addEventListener('click', onLoadMoreButton);

async function onFormSubmit(e) {
  e.preventDefault();
  loadMoreButton.classList.remove('hide');
  clearMarkup();
  inputValue = form.elements.searchQuery.value.trim();
  resetPage();

  console.log(inputValue);
  if (inputValue === '') {
    Notify.info('"Please make an inquiry"');
    return;
  }
  try {
    const response = await fetchPhoto(inputValue);
    if (response.data.hits.length !== 0) {
      console.log(response.data.hits);

      Notify.success(`We found ${response.data.totalHits}images`);

      const createMarkup = response.data.hits.map(createCardsMarkup).join('');
      cards.insertAdjacentHTML('beforeend', createMarkup);
      loadMoreButton.classList.add('hide');
      lightbox.refresh();
    } else {
      Notify.failure(
        '"Sorry, there are no images matching your search query. Please try again."'
      );
      loadMoreButton.classList.remove('hide');
    }
    clearInput();
  } catch (error) {
    console.log(error);
  }
}

function clearMarkup() {
  cards.innerHTML = '';
}
function clearInput() {
  form.reset();
}

function createCardsMarkup({
  largeImageURL,
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
  <div class="photo-card">
  <a class="link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
     <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
    </div>
    </div>`;
}

async function onLoadMoreButton() {
  // loadMoreButton.classList.remove('hide');

  // loadMoreButton.classList.add('hide');
  try {
    const response = await fetchPhoto(inputValue);

    let totalPages = `${response.data.totalHits}` / DEFAULT_PERPAGE;
    console.log(totalPages);

    // if (DEFAULT_PAGE > totalPages) {
    if (DEFAULT_PAGE < totalPages) {
      const createMarkup = response.data.hits.map(createCardsMarkup).join('');
      cards.insertAdjacentHTML('beforeend', createMarkup);
      loadMoreButton.classList.add('hide');
      lightbox.refresh();
    }
    if (DEFAULT_PAGE > totalPages || inputValue === '') {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreButton.classList.remove('hide');
    }

    // console.log(totalPages);
    // console.log(DEFAULT_PAGE);

    // const createMarkup = response.data.hits.map(createCardsMarkup).join('');
    // cards.insertAdjacentHTML('beforeend', createMarkup);
    // loadMoreButton.classList.add('hide');
  } catch (error) {
    console.log(error);
  }
}
