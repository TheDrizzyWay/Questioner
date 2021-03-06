const windowUrlArray = window.location.href.split('/');
windowUrlArray.pop();
const windowUrl = windowUrlArray.join('/');
let apiUrl = 'http://localhost:3000/api/v1';
if (window.location.href.split('.').includes('github')) {
  apiUrl = 'https://drizzyquestioner.herokuapp.com/api/v1';
}

const signupForm = document.querySelector('#signup_form');
const firstnameInput = document.querySelector('#firstname');
const lastnameInput = document.querySelector('#lastname');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const passwordConfInput = document.querySelector('#password_confirmation');
const usernameInput = document.querySelector('#username');
const phonenumberInput = document.querySelector('#phonenumber');
const submitBtn = document.querySelector('#submit');
const inputFields = [
  firstnameInput, lastnameInput, emailInput, passwordInput,
  passwordConfInput, usernameInput, phonenumberInput,
];

const removeClass = (errorclass) => {
  const errorText = document.querySelector(errorclass);
  if (errorText) {
    errorText.previousSibling.remove();
    errorText.nextSibling.remove();
    errorText.remove();
  }
};

const inputErrorHandler = (errorArray, errorData) => {
  errorArray.forEach((errorKey) => {
    const errorId = `${errorKey}`;
    const checkFieldError = inputFields.find(field => field.id === errorId);
    removeClass(`.${errorId}`);
    checkFieldError.insertAdjacentHTML('afterend', `
    <p class="${errorId}" id="red">${errorData[errorId][0]}</p><br>
    `);
  });
};

const emailErrorHandler = (errorData) => {
  removeClass('.emailerror');
  emailInput.insertAdjacentHTML('afterend', `
  <p class="emailerror" id="red">${errorData}</p><br>
  `);
};

const usernameErrorHandler = (errorData) => {
  removeClass('.usernameerror');
  usernameInput.insertAdjacentHTML('afterend', `
  <p class="usernameerror" id="red">${errorData}</p><br>
  `);
};

const loadSpinner = (element) => {
  const spinner = document.querySelector('.spinner');
  if (spinner) {
    spinner.remove();
    return;
  }
  element.insertAdjacentHTML('beforebegin', '<div class="spinner"></div>');
};

const fetchSignup = async (e) => {
  e.preventDefault();
  loadSpinner(submitBtn);
  removeClass('.emailerror');
  removeClass('.usernameerror');
  const firstname = firstnameInput.value;
  const lastname = lastnameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConf = passwordConfInput.value;
  const username = usernameInput.value;
  const phonenumber = phonenumberInput.value;

  submitBtn.value = 'Signing up...';
  submitBtn.disabled = true;
  const userObject = {
    firstname, lastname, username, email, password, password_confirmation: passwordConf, phonenumber,
  };

  await fetch(`${apiUrl}/auth/signup`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(userObject),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then((data) => {
      submitBtn.value = 'Signup';
      submitBtn.disabled = false;

      if (data.error) {
        if (data.status === 400) {
          loadSpinner();
          const errorData = data.error;
          const errorArray = Object.keys(data.error);
          return inputErrorHandler(errorArray, errorData);
        }
        if (data.status === 409) {
          loadSpinner();
          const errorData = data.error;
          if (errorData.includes('email')) return emailErrorHandler(errorData);
          return usernameErrorHandler(errorData);
        }
      }
      if (data.status === 201) {
        loadSpinner();
        submitBtn.disabled = true;
        const wrapper = document.getElementById('wrapper');
        signupForm.hidden = true;
        wrapper.insertAdjacentHTML('afterbegin', `
        <div class="signin-message">
        <p> You have successfully signed up. You will be redirected to the login page.</p>
        </div>
        `);
        setTimeout(() => {
          window.location.href = `${windowUrl}/signin.html`;
        }, 5000);
      }
      return true;
    })
    .catch((err) => {
      console.log(err);
      loadSpinner();
      submitBtn.disabled = false;
      submitBtn.value = 'Sign up';
    });
};

signupForm.addEventListener('submit', fetchSignup);
