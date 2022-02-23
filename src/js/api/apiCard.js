import axios from 'axios';
import settings from './settingsApi';

const { apiUrl, myKeyApi } = settings;

export const getImages = (searchValue, page = 1) => {
  return axios.get(`${apiUrl}?key=${myKeyApi}&q=${searchValue}&image_type=photo&safesearch=true&orientation=horizontal&per_page=40&page=${page}`);
};

