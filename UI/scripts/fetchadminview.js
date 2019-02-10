const meetupId = parseInt(window.location.href.split('=')[1], 10);
const windowUrlArray = window.location.href.split('/');
windowUrlArray.pop();
const windowUrl = windowUrlArray.join('/');
if (!meetupId) window.location.href = `${windowUrl}/adminhome.html`;
let apiUrl = 'http://localhost:3000/api/v1';
if (window.location.href.split('.').includes('github')) {
  apiUrl = 'https://drizzyquestioner.herokuapp.com/api/v1';
}

const token = localStorage.getItem('token');
const { body } = window.document;
const headerDiv = document.querySelector('.header_container');
const mainDiv = document.querySelector('.main_div');
const editBtn = document.querySelector('#modal-button');
const deleteBtn = document.querySelector('#delete-button');
const topDiv = document.querySelector('.top');
const simpleModal = document.getElementById('simple-modal');
const modalBtn = document.getElementById('modal-button');
const closeBtn = document.querySelector('.close_btn');
const editForm = document.querySelector('#edit-form');
const topicInput = document.querySelector('#topic');
const locationInput = document.querySelector('#location');
const imageInput = document.querySelector('#image');
const tagInput = document.querySelector('#tags');
const dateInput = document.querySelector('#date');
const submitBtn = document.querySelector('#submit');
const overlayMe = document.querySelector('#dialog-container');
const confirmBtn = document.querySelector('#confirm');
const cancelBtn = document.querySelector('#cancel');
const icons = document.querySelectorAll('img');
mainDiv.hidden = true;
editBtn.hidden = true;
deleteBtn.hidden = true;
const inputFields = [
  topicInput, locationInput, imageInput, tagInput, dateInput,
];

const processTags = (tagsArray) => {
  let tagsList = ' ';
  if (tagsArray.length === 0) return tagsList;
  tagsArray.map((tag) => {
    tagsList += `${tag} `;
    return tag;
  });
  return tagsList;
};

const convertDate = (createdon) => {
  const dateObject = new Date(createdon);
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: 'numeric',
  }).format(dateObject);

  return formattedDate;
};

const createNode = (element, className) => {
  const newElement = document.createElement(element);
  newElement.setAttribute('class', className);
  return newElement;
};

function openModal(e) {
  simpleModal.style.display = 'block';
  editForm.setAttribute('data-id', e.target.dataset.id);
  populateEditForm(e.target.dataset.id);
}

function closeModal() {
  simpleModal.style.display = 'none';
}

const openDeleteModal = (e) => {
  overlayMe.style.display = 'block';
  confirmBtn.setAttribute('data-id', e.target.dataset.id);
};

const closeDeleteModal = () => {
  overlayMe.style.display = 'none';
};

const responses = {
  tokenerrors: (errorData) => {
    checkTokenError(errorData);
  },
  notfound: (errorData) => {
    headerDiv.insertAdjacentHTML('afterend', `
    <div class="notfound">
    <p>${errorData}</p>
    </div>
    `);
  },
  success: (meetup) => {
    const allTags = meetup.tags ? processTags(meetup.tags) : '';
    const imageSource = meetup.image ? meetup.image : 'images/No_image.svg.png';
    const createdDate = convertDate(meetup.createdon);
    mainDiv.insertAdjacentHTML('afterbegin', `
    <p><span>Topic:</span> ${meetup.topic}</p>
    <p><span>Date:</span> ${meetup.happeningon}</p>
    <p><span>Location:</span> ${meetup.location}</p>
    <div class="loc_image">
      <p><span>Location Image:</span></p>
      <img src="${imageSource}" alt="location.jpg">
    </div>
    <div class="tags">
      <p><span>Tags:</span></p>
      <div>${allTags}</div>
    </div>
    <p><span>Created on:</span> ${createdDate}</p>
    <p><span>Respondents:</span> ${meetup.joinedUsers} user(s) have joined this meetup</p>
    `);
    fetchTopQuestions();
  },
};

const checkTokenError = (errorData) => {
  if (errorData.includes('Unauthorized')
|| errorData.includes('Log')
|| errorData.includes('verifying')) {
    localStorage.clear();
    window.location.href = `${windowUrl}/signin.html`;
  }
};

const fetchOneMeetup = async () => {
  await fetch(`${apiUrl}/meetups/${meetupId}`, {
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
      if (status === 401 || status === 403) return responses.tokenerrors(data.error);
      if (status === 422 || status === 404) return responses.notfound(data.error);
      if (status === 200) {
        const meetup = data.data;
        responses.success(meetup);
      }
      return true;
    })
    .catch(err => console.log(err));
};

const fetchTopQuestions = async () => {
  await fetch(`${apiUrl}/meetups/${meetupId}/top`, {
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
      if (status === 200) {
        const topQuestionsArray = data.data;
        if (topQuestionsArray.length === 0) topDiv.hidden = true;
        topDiv.insertAdjacentHTML('afterbegin', '<p id="top">Top Questions</p>');
        topQuestionsArray.forEach((question) => {
          topDiv.insertAdjacentHTML('beforeend', `
          <div class="question">
          <p>Question: ${question.body}</p>
          <p>Posted by: ${question.userid}</p>
          <p>Upvotes: ${question.upvotes}</p>
          <p>Downvotes: ${question.downvotes}</p>
          </div>
          `);
        });
        mainDiv.hidden = false;
        editBtn.hidden = false;
        deleteBtn.hidden = false;
        editBtn.setAttribute('data-id', meetupId);
        deleteBtn.setAttribute('data-id', meetupId);
        icons.forEach((icon) => {
          icon.setAttribute('data-id', meetupId);
        });
      }
    })
    .catch(err => console.log(err));
};

const populateEditForm = async (id) => {
  await fetch(`${apiUrl}/meetups/${id}`, {
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
        const meetup = data.data;
        const resultKeys = Object.keys(meetup);
        resultKeys.forEach((key) => {
          const keyString = key.toString();
          const keyInput = inputFields.find(field => field.id === keyString);
          if (keyInput) keyInput.placeholder = meetup[key];
        });
      }
    })
    .catch(err => console.log(err));
};

const fetchEditMeetup = async (e) => {
  e.preventDefault();
  submitBtn.value = 'Editing...';
  submitBtn.disabled = true;

  const formData = new FormData(e.target);
  const editTags = formData.getAll('tags-input')[0].split(',');
  if (editTags) {
    formData.delete('tags-input');
    editTags.forEach((tag) => {
      formData.append('tags[]', tag);
    });
  }

  await fetch(`${apiUrl}/meetups/${e.target.dataset.id}`, {
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
        const errorDiv = createNode('div', 'error_div');
        errorDiv.innerHTML = errorData;
        editForm.insertBefore(errorDiv, editForm.firstChild);
      }
      if (data.status === 200) {
        while (editForm.firstChild) editForm.removeChild(editForm.firstChild);
        editForm.innerHTML = `<div class="notfound">
        <p>Meetup Edited Successfully.</p></div>`;
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

const fetchDeleteMeetup = async (e) => {
  await fetch(`${apiUrl}/meetups/${e.target.dataset.id}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then((data) => {
      if (data.status === 200) {
        overlayMe.innerHTML = `<div class="popup">
          <p>Meetup Deleted Successfully</p></div>`;
        setTimeout(() => {
          window.location.href = `${windowUrl}/adminhome.html`;
        }, 2000);
      }
    })
    .catch(err => console.log(err));
};

body.addEventListener('load', fetchOneMeetup());
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
editForm.addEventListener('submit', fetchEditMeetup);
deleteBtn.addEventListener('click', openDeleteModal);
cancelBtn.addEventListener('click', closeDeleteModal);
confirmBtn.addEventListener('click', fetchDeleteMeetup);
