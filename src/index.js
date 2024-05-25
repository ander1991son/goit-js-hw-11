// // axios
// //   .get('https://pixabay.com/api/?key="41167755-70f3c314cd8390efeff4b47a8"')
// //   .then(res => {
// //     console.log(res.data);
// //   });

// ////
// import axios from 'axios';
// import Notiflix from 'notiflix';

// const API_KEY = '41167755-70f3c314cd8390efeff4b47a8';
// const API_URL = `https://pixabay.com/api/`;

// let currentPage = 1;
// let currentQuery = '';
// let totalHits = 0;

// document.getElementById('search-form').addEventListener('submit', async e => {
//   e.preventDefault();

//   const query = e.target.elements.searchQuery.value.trim();

//   if (!query) {
//     Notiflix.Notify.warning('Please enter a search term');
//     return;
//   }

//   // Reset pagination for new query
//   currentPage = 1;
//   currentQuery = query;
//   totalHits = 0;

//   // Hide load more button before new search
//   document.querySelector('.load-more').style.display = 'none';

//   // Update the URL in the browser
//   const newUrl = `${window.location.origin}/${query}`;
//   history.pushState({ path: newUrl }, '', newUrl);

//   try {
//     const response = await fetchImages(query, currentPage);
//     const images = response.data.hits;
//     totalHits = response.data.totalHits;

//     Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

//     if (images.length === 0) {
//       Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     } else {
//       displayGallery(images);

//       // Show load more button if there are more images to load
//       if (images.length < totalHits) {
//         document.querySelector('.load-more').style.display = 'block';
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching images:', error);
//     Notiflix.Notify.failure('Error fetching images. Please try again later.');
//   }
// });

// document.querySelector('.load-more').addEventListener('click', async () => {
//   currentPage += 1;

//   try {
//     const response = await fetchImages(currentQuery, currentPage);
//     const images = response.data.hits;

//     if (images.length === 0) {
//       Notiflix.Notify.failure(
//         "We're sorry, but you've reached the end of search results."
//       );
//       document.querySelector('.load-more').style.display = 'none';
//     } else {
//       displayGallery(images);

//       // Hide load more button if no more images to load
//       if ((currentPage - 1) * 40 + images.length >= totalHits) {
//         document.querySelector('.load-more').style.display = 'none';
//         Notiflix.Notify.info(
//           "We're sorry, but you've reached the end of search results."
//         );
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching images:', error);
//     Notiflix.Notify.failure('Error fetching images. Please try again later.');
//   }
// });

// async function fetchImages(query, page) {
//   const response = await axios.get(API_URL, {
//     params: {
//       key: API_KEY,
//       q: query,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//       page: page,
//       per_page: 40,
//     },
//   });
//   return response;
// }

// function displayGallery(images) {
//   const galleryContainer = document.querySelector('.gallery');

//   // Clear gallery only on first page load
//   if (currentPage === 1) {
//     galleryContainer.innerHTML = ''; // Clear previous results
//   }

//   images.forEach(image => {
//     const item = document.createElement('div');
//     item.classList.add('photo-card');
//     item.innerHTML = `
//       <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
//       <div class="info">
//         <p class="info-item"><b>Tags:</b> ${image.tags}</p>
//         <p class="info-item"><b>Likes:</b> ${image.likes}</p>
//         <p class="info-item"><b>Views:</b> ${image.views}</p>
//         <p class="info-item"><b>Comments:</b> ${image.comments}</p>
//         <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
//       </div>
//       <a href="${image.largeImageURL}" target="_blank">View Large Image</a>
//     `;
//     galleryContainer.appendChild(item);
//   });
// }

////

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '41167755-70f3c314cd8390efeff4b47a8';
const API_URL = `https://pixabay.com/api/`;

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
let lightbox;

document.getElementById('search-form').addEventListener('submit', async e => {
  e.preventDefault();

  const query = e.target.elements.searchQuery.value.trim();

  if (!query) {
    Notiflix.Notify.warning('Please enter a search term');
    return;
  }

  // Reset pagination for new query
  currentPage = 1;
  currentQuery = query;
  totalHits = 0;

  // Update the URL in the browser
  const newUrl = `${window.location.origin}/${query}`;
  history.pushState({ path: newUrl }, '', newUrl);

  // Clear previous results
  document.querySelector('.gallery').innerHTML = '';

  try {
    const response = await fetchImages(query, currentPage);
    const images = response.data.hits;
    totalHits = response.data.totalHits;

    // Notify the user about the total hits
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      displayGallery(images);
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Error fetching images. Please try again later.');
  }
});

window.addEventListener('scroll', async () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    currentQuery
  ) {
    currentPage += 1;
    try {
      const response = await fetchImages(currentQuery, currentPage);
      const images = response.data.hits;

      if ((currentPage - 1) * 40 + images.length >= totalHits) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      displayGallery(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      Notiflix.Notify.failure('Error fetching images. Please try again later.');
    }
  }
});

async function fetchImages(query, page) {
  const response = await axios.get(API_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 40,
    },
  });
  return response;
}

function displayGallery(images) {
  const galleryContainer = document.querySelector('.gallery');

  images.forEach(image => {
    const item = document.createElement('a');
    item.href = image.largeImageURL;
    item.classList.add('photo-card');
    item.innerHTML = `
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Tags:</b> ${image.tags}</p>
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    `;
    galleryContainer.appendChild(item);
  });

  // Initialize or refresh SimpleLightbox
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a');
  }

  // Scroll smoothly
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
