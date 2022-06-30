const form = document.querySelector('.search-form');
const button = document.querySelector('button');

button.addEventListener('click', onFormInput);

function onFormInput(e) {
  e.preventDefault();
}
