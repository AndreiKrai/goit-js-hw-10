import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';
const countiesListContainer = document.querySelector('.country-list');
const countyContainer = document.querySelector('.country-info');

const inputEl = document.querySelector('#search-box');

const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  fetchCountries(event.target.value.trim())
    .then(data => {
      clearMarkup(countiesListContainer);
      clearMarkup(countyContainer);
      if (data.length === 0) {
        return;
      }
      if (data.length === 1) {
        renderSingleCountry(data);
      }

      if (data.length > 1 && data.length < 11) {
        renderCountriesList(data);
      }
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(err =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function clearMarkup(container) {
  container.innerHTML = '';
}

function renderSingleCountry(data) {
  const markup = data
    .map(({ flags, name, languages, population, capital }) => {
      return `<div class=bigList><img src="${
        flags.svg
      }" width = "75" alt = "flag"/>
    ${name.official}</div>
    <ul><li class=list>Capital: ${capital}</li>
    <li class=list>Population: ${population}</li>
    <li class=list>Languages: ${Object.values(languages).join(',')}</li></ul>`;
    })
    .join('');
  // console.log(languages[key].join(','));
  countyContainer.insertAdjacentHTML('beforeend', markup);
}

function renderCountriesList(data) {
  const markup = data
    .map(({ flags, name }) => {
      return `<li> <img src="${flags.svg}" alt="${name.official}"width='30' height='30' >
      <p>${name.official}</p>
          </li>`;
    })
    .join('');
  console.log(data);
  countiesListContainer.insertAdjacentHTML('beforeend', markup);
}
