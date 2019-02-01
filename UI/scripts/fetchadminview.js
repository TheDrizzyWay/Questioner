const meetupId = parseInt(window.location.href.split('=')[1], 10);
const windowUrlArray = window.location.href.split('/');
windowUrlArray.pop();
const windowUrl = windowUrlArray.join('/');
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

const responses = {
  tokenerrors: (errorData) => {
    checkTokenError(errorData);
  },
  notfound: (errorData) => {
    mainDiv.hidden = true;
    editBtn.hidden = true;
    deleteBtn.hidden = true;
    headerDiv.insertAdjacentHTML('afterend', `
    <div class="notfound">
    <p>${errorData}</p>
    </div>
    `);
  },
  success: (meetup) => {
    const allTags = processTags(meetup.tags);
    const createdDate = convertDate(meetup.createdon);
    mainDiv.insertAdjacentHTML('afterbegin', `
    <p><span>Topic:</span> ${meetup.topic}</p>
    <p><span>Date:</span> ${meetup.happeningon}</p>
    <p><span>Location:</span> ${meetup.location}</p>
    <div class="loc_image">
      <p><span>Location Image:</span></p>
      <img src="images/meeting2.jpg" alt="location.jpg">
    </div>
    <div class="tags">
      <p><span>Tags:</span></p>
      <div>${allTags}</div>
    </div>
    <p><span>Created on:</span> ${createdDate}</p>
    <p><span>Respondents:</span> ${meetup.joinedUsers} users have joined this meetup</p>
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
      }
    })
    .catch(err => console.log(err));
};

body.addEventListener('load', fetchOneMeetup());
