const windowUrlArray = window.location.href.split('/');
windowUrlArray.pop();
const windowUrl = windowUrlArray.join('/');
let apiUrl = 'http://localhost:3000/api/v1';
if (window.location.href.split('.').includes('github')) {
  apiUrl = 'https://drizzyquestioner.herokuapp.com/api/v1';
}
const loginForm = document.querySelector('.lower');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const submitBtn = document.querySelector('#submit');
const createNode = element => document.createElement(element);
const appendNode = (parent, element) => parent.appendChild(element);
const removeClass = (errorclass) => {
  const errorDivSelect = document.querySelector(errorclass);
  if (errorDivSelect) {
    errorDivSelect.remove();
  }
};

const createErrorDiv = () => {
  const errorDiv = createNode('div');
  errorDiv.setAttribute('class', 'error_div');
  return errorDiv;
};

const responses = {
  400: (dataError) => {
    submitBtn.disabled = false;
    submitBtn.value = 'Sign in';
    removeClass('.error_div');
    const errorDiv = createErrorDiv();
    let errorList = '<ul>';
    const errorArray = Object.keys(dataError);
    errorArray.forEach((errorKey) => {
      errorList += `<li>${dataError[errorKey][0]}</li>`;
    });
    errorList += '</ul>';
    errorDiv.innerHTML = errorList;
    appendNode(loginForm, errorDiv);
  },
  401: (dataError) => {
    submitBtn.disabled = false;
    submitBtn.value = 'Sign in';
    removeClass('.error_div');
    const errorDiv = createErrorDiv();
    errorDiv.innerHTML = dataError;
    appendNode(loginForm, errorDiv);
  },
  200: (loginData) => {
    submitBtn.disabled = true;
    const { token, isadmin } = loginData;
    localStorage.setItem('token', token);
    localStorage.setItem('isadmin', isadmin);
    const defaultPage = loginData.isadmin ? 'adminhome.html' : 'userhome.html';
    window.location.href = `${windowUrl}/${defaultPage}`;
  },
};

const fetchLogin = async (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;
  submitBtn.value = 'Logging in...';
  submitBtn.disabled = true;
  const userObject = { email, password };

  await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(userObject),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then((data) => {
      if (data.status === 400) return responses[400](data.error);
      if (data.status === 401) return responses[401](data.error);
      if (data.status === 200) {
        const loginData = data.data[0];
        responses[200](loginData);
      }
      return true;
    })
    .catch((err) => {
      console.log(err);
      submitBtn.disabled = false;
      submitBtn.value = 'Sign in';
    });
};

loginForm.addEventListener('submit', fetchLogin);
