import './sass/main.scss';
import { getImages }  from './js/api/apiCard';
import imagesCards from './js/components/imagesCards'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash/throttle';


const galleryRefs = document.querySelector('.gallery');
const formRefs = document.querySelector('#search-form');

let page = 1;
let currentSearchValue = '';
let galleryModal = null;

const options = {
    captionDelay: 250,  
}


const infiniteScrollThrottle = throttle(infiniteScroll, 500);
window.addEventListener('scroll', infiniteScrollThrottle);
formRefs.addEventListener('submit', searchImages)

async function requestServer(searchValue, page) {
    const responseServer = await getImages(searchValue, page);
    const dataImages = responseServer.data 
    return dataImages;
}

function renderCards(template) {
    galleryRefs.insertAdjacentHTML('beforeend', template)
}

async function searchImages(event) {
    event.preventDefault();
    galleryRefs.innerHTML = '';
    page = 1;
    currentSearchValue = formRefs.searchQuery.value.trim();    

    if (currentSearchValue.length === 0) {
        return
    } else {
        const responseServer = await requestServer(currentSearchValue);        
        const { hits, totalHits } = responseServer;

        if (hits.length === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } else {
            Notify.success(`Hooray! We found ${totalHits} images.`);
            const templateOfImages = imagesCards(hits);
            renderCards(templateOfImages);
            
            galleryModal = new SimpleLightbox('.gallery a', options);
            // loadMoreBtn.style.display = 'block';           
        }
    }
    formRefs.reset()
}


async function infiniteScroll() {           
    const contentHeight = galleryRefs.offsetHeight;      
    const yOffset       = window.pageYOffset;      
    const window_height = window.innerHeight;      
    const y             = yOffset + window_height;    

    if (y >= contentHeight) {
        
        console.log('scroll')
        page += 1;
        const responseServer = await requestServer(currentSearchValue, page);

        const { totalHits, hits } = responseServer;
        const templateOfImages = imagesCards(hits);
        renderCards(templateOfImages);
        galleryModal.refresh()

        if (totalHits / 40 < page) {
            console.log('finish')
            window.removeEventListener('scroll', infiniteScrollThrottle);
            Notify.info("We're sorry, but you've reached the end of search results.")
        }  
    }
}