import axios from 'axios';
// const axios = require('axios').default;
const API_KEY = '28369554-8a41aa323918ac947077e13c4';
let DEFAULT_PAGE = 1;
const DEFAULT_PERPAGE = 40;
const BASE_URL = 'https://pixabay.com/api/';

async function fetchPhoto(inputValue) {
  const URL = `${BASE_URL}?key=${API_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${DEFAULT_PERPAGE}&page=${DEFAULT_PAGE}`;
  const response = await axios.get(URL);

  DEFAULT_PAGE += 1;
  console.log(response.data.totalHits);
  return response;
}

export { fetchPhoto };
export { DEFAULT_PAGE, DEFAULT_PERPAGE };
