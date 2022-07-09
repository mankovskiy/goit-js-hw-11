import 'modern-normalize';
import { fetchPhoto, DEFAULT_PAGE } from './fetchPhoto';
import { DEFAULT_PAGE } from './fetchPhoto';
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

function onFormSubmit(e) {
  e.preventDefault();
  clearMarkup();

  inputValue = form.elements.searchQuery.value.trim();
  console.log(inputValue);
  if (!inputValue) {
    Notify.info('"Please make an inquiry"');
    return;
  }
  return fetchPhoto(inputValue)
    .then(response => {
      if (response.hits.length !== 0) {
        console.log(response.hits);

        Notify.success(`We found ${response.totalHits}images`);
        const createMarkup = response.hits.map(createCardsMarkup).join('');
        cards.insertAdjacentHTML('beforeend', createMarkup);
        loadMoreButton.classList.remove('hide');
        lightbox.refresh();
      } else {
        Notify.failure(
          '"Sorry, there are no images matching your search query. Please try again."'
        );
      }

      clearInput();
    })
    .catch(Error => {
      console.log(Error);
    });
}

// function createMarkup(params) {}

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

function onLoadMoreButton() {
  // loadMoreButton.classList.add('hide');

  // response.totalHits;
  return fetchPhoto(inputValue).then(response => {
    let totalPages = `${response.totalHits}` / 40;

    console.log(totalPages);
    console.log(DEFAULT_PAGE);

    if (DEFAULT_PAGE > totalPages) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );

      const createMarkup = response.hits.map(createCardsMarkup).join('');
      cards.insertAdjacentHTML('beforeend', createMarkup);
      loadMoreButton.classList.add('hide');
    }
    if (DEFAULT_PAGE < totalPages) {
      const createMarkup = response.hits.map(createCardsMarkup).join('');
      cards.insertAdjacentHTML('beforeend', createMarkup);
      loadMoreButton.classList.remove('hide');
      lightbox.refresh();
    }

    // loadMoreButton.classList.remove('hide');
  });
}
