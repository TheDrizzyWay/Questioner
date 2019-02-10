const windowUrlArray = window.location.href.split('/');
windowUrlArray.pop();
const windowUrl = windowUrlArray.join('/');
let apiUrl = 'http://localhost:3000/api/v1';
if (window.location.href.split('.').includes('github')) {
  apiUrl = 'https://drizzyquestioner.herokuapp.com/api/v1';
}

const token = localStorage.getItem('token');
const detailsDiv = document.querySelector('.user_details');
const activityDiv = document.querySelector('.activities');
const simpleModal = document.getElementById('simple-modal');
const closeBtn = document.querySelector('.close_btn');
const profileForm = document.querySelector('#profile-form');
const firstnameInput = document.querySelector('#firstname');
const lastnameInput = document.querySelector('#lastname');
const usernameInput = document.querySelector('#username');
const submitBtn = document.querySelector('#submit');
const { body } = window.document;
const inputFields = [firstnameInput, lastnameInput, usernameInput];

function openModal() {
  simpleModal.style.display = 'block';
  populateEditModal();
}

function closeModal() {
  simpleModal.style.display = 'none';
}

const responses = {
  tokenerrors: (errorData) => {
    if (errorData.includes('Unauthorized')
  || errorData.includes('Log')
  || errorData.includes('verifying')) {
      localStorage.clear();
      window.location.href = `${windowUrl}/signin.html`;
    }
  },
  success: (profile) => {
    const {
      firstname, lastname, username, joinedMeetups,
      questionsPosted, commentedOn, allComments,
    } = profile[0];
    detailsDiv.innerHTML = `<p>First Name: ${firstname}</p>
    <p>Last Name: ${lastname}</p>
    <p>Username: ${username}</p>
    <button id="modal-button">Edit Details</button>`;
    activityDiv.innerHTML = `<p>Number of meetups joined: <span>${joinedMeetups}</span></p>
    <p>Number of questions posted: <span>${questionsPosted}</span></p>
    <p>Number of questions commented on: <span>${commentedOn}</span></p>
    <p>Total number of comments posted: <span>${allComments}</span></p>`;
    const modalBtn = document.querySelector('#modal-button');
    modalBtn.addEventListener('click', openModal);
  },
};

const fetchProfile = async () => {
  await fetch(`${apiUrl}/users/profile`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then((data) => {
      const { status } = data;
      if (status === 401 || status === 500) return responses.tokenerrors(data.error);
      if (status === 200) {
        const profile = data.data;
        responses.success(profile);
      }
      return true;
    })
    .catch(err => console.log(err));
};

const populateEditModal = async () => {
  await fetch(`${apiUrl}/users/profile`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then((data) => {
      if (data.status === 200) {
        const profile = data.data;
        const resultKeys = Object.keys(profile[0]);
        resultKeys.forEach((key) => {
          const keyString = key.toString();
          const keyInput = inputFields.find(field => field.id === keyString);
          if (keyInput) keyInput.placeholder = profile[0][key];
        });
      }
    })
    .catch(err => console.log(err));
};

const fetchEditProfile = async (e) => {
  e.preventDefault();
  submitBtn.value = 'Updating...';
  submitBtn.disabled = true;

  const formData = new FormData(e.target.parentNode);

  await fetch(`${apiUrl}/users`, {
    method: 'PUT',
    mode: 'cors',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then((data) => {
      if (data.error) {
        const errorData = data.error;
        submitBtn.disabled = false;
        submitBtn.value = 'Submit';
        const errorDivSelect = document.querySelector('.error_div');
        if (errorDivSelect) {
          errorDivSelect.remove();
        }
        const errorDiv = document.createElement('div');
        errorDiv.setAttribute('class', 'error_div');
        errorDiv.innerHTML = errorData;
        profileForm.insertBefore(errorDiv, profileForm.firstChild);
      }
      if (data.status === 200) {
        while (profileForm.firstChild) profileForm.removeChild(profileForm.firstChild);
        profileForm.innerHTML = `<div class="notfound">
        <p>Profile Updated Successfully.</p></div>`;
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    })
    .catch((err) => {
      console.log(err);
      submitBtn.disabled = false;
      submitBtn.value = 'Submit';
    });
};

body.addEventListener('load', fetchProfile());
closeBtn.addEventListener('click', closeModal);
submitBtn.addEventListener('click', fetchEditProfile);
