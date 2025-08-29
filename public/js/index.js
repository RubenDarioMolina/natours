/* eslint-disable */
import '@babel/polyfill';
import { bookTour } from './stripe';
import displayMap from './leaflet';
import logs from './login.js';
import { updateSettings } from './updateSettings';
import { showAlert } from './alert';

// DOM elements
const leaflet = document.getElementById('map');
const logOutBtn = document.querySelector('.nav__el--logout');
const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
// console.log(bookBtn);
// values
//delegation
if (leaflet) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations,
  );
  displayMap(locations);
}

if (loginForm) {
  console.log('error');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    logs.login(email, password);
  });
}
if (logOutBtn) logOutBtn.addEventListener('click', logs.logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log('hi', form);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    // console.log(passwordCurrent, password, passwordConfirm);
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Procesing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
const alertMessage = document.querySelector('body').dataset.alert;
console.log(alertMessage);
if (alertMessage) showAlert('success', alertMessage);
