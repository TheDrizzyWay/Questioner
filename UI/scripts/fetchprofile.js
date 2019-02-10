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
const { body } = window.document;

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
    console.log(profile);
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

body.addEventListener('load', fetchProfile());
