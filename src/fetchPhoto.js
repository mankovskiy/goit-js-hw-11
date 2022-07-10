// import axios from 'axios';
const axios = require('axios').default;
const API_KEY = '28369554-8a41aa323918ac947077e13c4';
let DEFAULT_PAGE = 1;
const DEFAULT_PERPAGE = 40;
// const URL = 'https://pixabay.com/api/';

async function fetchPhoto(inputValue) {
  axios.defaults.headers.common['Authorization'] = API_KEY;
  axios.defaults.baseURL = 'https://pixabay.com/api/';

  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: `${inputValue}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: `${DEFAULT_PERPAGE}`,
    page: `${DEFAULT_PAGE}`,
  });

  // param = `?key=${API_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=truekk&page=${page}&per_page=${perPage}`;
  // const resp = await axios.get(URL + param);
  // console.log(param);
  const response = await axios.get(`?${searchParams}`);

  // return fetch(`https://pixabay.com/api/?${searchParams}`).then(response => {
  //   if (!response.ok) {
  //     throw new Error('Error fetching data');
  //   }
  DEFAULT_PAGE += 1;
  console.log(response);
  return response;

  // });
}

// .then(() => {
//   DEFAULT_PAGE += 1;
// });

export { fetchPhoto };
export { DEFAULT_PAGE };
