const windowUrlArray = window.location.href.split('/');
windowUrlArray.pop();
const windowUrl = windowUrlArray.join('/');
let apiUrl = 'http://localhost:3000/api/v1';
if (window.location.href.split('.').includes('github')) {
  apiUrl = 'https://drizzyquestioner.herokuapp.com/api/v1';
}
const meetContainer = document.querySelector('.meet_container');
const logout = document.querySelector('.logout');
const simpleModal = document.getElementById('simple-modal');
const modalBtn = document.getElementById('modal-button');
const closeBtn = document.querySelector('.close_btn');
const topDiv = document.querySelector('.create');
const meetupForm = document.querySelector('#meetup-form');
const submitBtn = document.querySelector('#submit');
const { body } = window.document;

const createNode = (element, className) => {
  const newElement = document.createElement(element);
  newElement.setAttribute('class', className);
  return newElement;
};
const appendNewNode = (parent, element) => parent.insertBefore(element, parent.firstChild);

function openModal() {
  simpleModal.style.display = 'block';
}

function closeModal() {
  simpleModal.style.display = 'none';
}

const loadSpinner = (element) => {
  const spinner = document.querySelector('.spinner');
  if (spinner) {
    spinner.remove();
    return;
  }
  element.insertAdjacentHTML('beforebegin', '<div class="spinner"></div>');
};

const responses = {
  errors: (errorData) => {
    if (errorData.includes('Unauthorized')
  || errorData.includes('Log')
  || errorData.includes('verifying')) {
      localStorage.clear();
      window.location.href = `${windowUrl}/signin.html`;
    }
  },
  createErrors: (errorData) => {
    submitBtn.disabled = false;
    submitBtn.value = 'Submit';
    const errorKeys = Object.keys(errorData);
    console.log(errorData);
    const errorDivSelect = document.querySelector('.error_div');
    if (errorDivSelect) {
      errorDivSelect.remove();
    }
    const errorDiv = createNode('div', 'error_div');
    errorDiv.innerHTML = errorData[errorKeys[0]];
    meetupForm.insertBefore(errorDiv, meetupForm.firstChild);
  },
  success: (meetups) => {
    meetups.paginatedResult.forEach((meetup) => {
      const meetupNode = createNode('div', 'meet');
      const imageSource = meetup.image ? meetup.image : 'images/No_image.svg.png';
      meetupNode.innerHTML = `<img src="${imageSource}" alt="location image">
      <p>TOPIC: ${meetup.topic}</p>
      <p>DATE: ${meetup.happeningon}</p>
      <a href="adminview.html?id=${meetup.id}" data-id="${meetup.id}"><button>View</button></a>`;
      appendNewNode(meetContainer, meetupNode);
    });
  },
  created: () => {
    loadSpinner();
    submitBtn.value = 'Submit';
    submitBtn.disabled = false;
    closeModal();
    while (meetContainer.firstChild) meetContainer.removeChild(meetContainer.firstChild);
    topDiv.insertAdjacentHTML('afterend', `
    <div class="success"><p>Meetup created successfully.</p></div>
    `);
    const message = document.querySelector('.success');
    fetchMeetups();
    setTimeout(() => message.remove(), 2000);
  },
};

const fetchMeetups = async () => {
  loadSpinner(topDiv);
  const token = localStorage.getItem('token');

  await fetch(`${apiUrl}/meetups`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then((data) => {
      if (data.error) {
        loadSpinner();
        const errorData = data.error;
        return responses.errors(errorData);
      }
      if (data.status === 200) {
        loadSpinner();
        const meetups = data.data;
        return responses.success(meetups);
      }
      return true;
    })
    .catch((err) => {
      loadSpinner();
      console.log(err);
    });
};

const createMeetup = async (e) => {
  e.preventDefault();
  loadSpinner(submitBtn);
  submitBtn.value = 'Creating...';
  submitBtn.disabled = true;
  const token = localStorage.getItem('token');
  const formData = new FormData(e.target);
  const tags = formData.getAll('tags-input')[0].split(',');
  formData.delete('tags-input');
  tags.forEach((tag) => {
    formData.append('tags[]', tag);
  });
  await fetch(`${apiUrl}/meetups`, {
    method: 'POST',
    mode: 'cors',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then((data) => {
      if (data.error) {
        loadSpinner();
        const errorData = data.error;
        return responses.createErrors(errorData);
      }
      if (data.status === 201) return responses.created();
      return true;
    })
    .catch((err) => {
      loadSpinner();
      console.log(err);
      submitBtn.disabled = false;
      submitBtn.value = 'Submit';
    });
};

body.addEventListener('load', fetchMeetups());
logout.addEventListener('click', () => {
  localStorage.clear();
});
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
meetupForm.addEventListener('submit', createMeetup);
