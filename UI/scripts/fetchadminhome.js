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
const topicInput = document.querySelector('#topic');
const locationInput = document.querySelector('#location');
const imageInput = document.querySelector('#file');
const tagNames = document.querySelector('input[name="tags-input"]');
const dateInput = document.querySelector('#date');
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
    const errorDivSelect = document.querySelector('.error_div');
    if (errorDivSelect) {
      errorDivSelect.remove();
    }
    const errorDiv = createNode('div', 'error_div');
    errorDiv.innerHTML = errorData;
    meetupForm.insertBefore(errorDiv, meetupForm.firstChild);
  },
  success: (meetups) => {
    meetups.forEach((meetup) => {
      let imageSource;
      if (meetup.id % 2 === 0) {
        imageSource = 'images/meeting2.jpg';
      } else {
        imageSource = 'images/meetings2.jpg';
      }
      const meetupNode = createNode('div', 'meet');
      meetupNode.innerHTML = `<img src="${imageSource}" alt="location.jpg">
      <p>TOPIC: ${meetup.topic}</p>
      <p>DATE: ${meetup.happeningon}</p>
      <a href="adminview.html?id=${meetup.id}" data-id="${meetup.id}"><button>View</button></a>`;
      appendNewNode(meetContainer, meetupNode);
    });
  },
  created: () => {
    closeModal();
    topDiv.insertAdjacentHTML('afterend', `
    <div class="success">
    <p>Meetup created successfully.</p>
    </div>
    `);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  },
};

const fetchMeetups = async () => {
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
        const errorData = data.error;
        return responses.errors(errorData);
      }
      if (data.status === 200) {
        const meetups = data.data;
        return responses.success(meetups);
      }
      return true;
    })
    .catch(err => console.log(err));
};

const createMeetup = async (e) => {
  e.preventDefault();
  submitBtn.value = 'Creating...';
  submitBtn.disabled = true;
  const token = localStorage.getItem('token');
  const topic = topicInput.value;
  const location = locationInput.value;
  const image = imageInput.value;
  const tags = tagNames.value.split(',');
  const happeningon = dateInput.value;
  const meetupObject = {
    topic, location, image, tags, happeningon,
  };

  await fetch(`${apiUrl}/meetups`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(meetupObject),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then((data) => {
      if (data.error) {
        const errorData = data.error;
        return responses.createErrors(errorData);
      }
      if (data.status === 201) return responses.created();
      return true;
    })
    .catch((err) => {
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
