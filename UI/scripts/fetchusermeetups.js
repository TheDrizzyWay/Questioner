const meetupId = parseInt(window.location.href.split('=')[1], 10);
const windowUrlArray = window.location.href.split('/');
windowUrlArray.pop();
const windowUrl = windowUrlArray.join('/');
if (!meetupId) window.location.href = `${windowUrl}/userhome.html`;
const userId = localStorage.getItem('id');
let apiUrl = 'http://localhost:3000/api/v1';
if (window.location.href.split('.').includes('github')) {
  apiUrl = 'https://drizzyquestioner.herokuapp.com/api/v1';
}

const token = localStorage.getItem('token');
const meetupTopic = localStorage.getItem('meetuptopic');
const postDiv = document.querySelector('.add');
const container = document.querySelector('.container');
const topicSpan = document.querySelector('#topic-span');
const simpleModal = document.getElementById('simple-modal');
const modalBtn = document.getElementById('modal-button');
const closeBtn = document.querySelector('.close_btn');
const questionForm = document.querySelector('#question-form');
const titleInput = document.querySelector('#title');
const questionInput = document.querySelector('#question');
const submitBtn = document.querySelector('#submit');
questionForm.setAttribute('data-id', meetupId);
const { body } = window.document;

const createNode = (element, className) => {
  const newElement = document.createElement(element);
  newElement.setAttribute('class', className);
  return newElement;
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

function openModal() {
  simpleModal.style.display = 'block';
}

function closeModal() {
  simpleModal.style.display = 'none';
}

const responses = {
  notfound: (errorData) => {
    postDiv.insertAdjacentHTML('afterend', `
    <div class="notfound">
    <p>${errorData}</p>
    </div>
    `);
  },
  createErrors: (errorData) => {
    submitBtn.disabled = false;
    const errorDivSelect = document.querySelector('.error_div');
    if (errorDivSelect) {
      errorDivSelect.remove();
    }
    const errorKeys = Object.keys(errorData);
    const errorDiv = createNode('div', 'error_div');
    errorDiv.innerHTML = errorData[errorKeys[0]];
    questionForm.insertBefore(errorDiv, questionForm.children[1]);
  },
  voteErrors: (errorData, e) => {
    const errorDivSelect = document.querySelector('.error_div');
    if (errorDivSelect) {
      errorDivSelect.remove();
    }
    const voteError = createNode('div', 'error_div');
    voteError.style.marginTop = '10px';
    voteError.style.marginLeft = '10px';
    voteError.innerHTML = errorData;
    e.target.parentElement.appendChild(voteError);
  },
  success: (questions) => {
    if (questions.length === 0) {
      container.insertAdjacentHTML('afterbegin', `
      <div class="notfound"><p>No questions found.</p>
      </div>`);
      return;
    }
    topicSpan.innerHTML = meetupTopic;
    questions.forEach((question) => {
      const newDate = convertDate(question.createdon);
      if (question.userid === parseInt(userId, 10)) {
        container.insertAdjacentHTML('afterbegin', `
        <div class="questions">
          <p><span>Title: </span>${question.title}</p>
          <p><span>Question: </span>${question.body}</p>
          <p><span>Upvotes: </span>${question.upvotes}</p>
          <p><span>Downvotes: </span>${question.downvotes}</p>
          <p><span>Posted By: </span>${question.postedby} <span>On </span>${newDate}</p>
          <div class="actions">
            <span>${question.numbercomments} Comment(s)</span><a href="usercomments.html?id=${question.id}">
            <img src="images/edit.png" alt="comments"></a>
          </div>
        </div>
        `);
      } else {
        container.insertAdjacentHTML('afterbegin', `
        <div class="questions">
          <p><span>Title: </span>${question.title}</p>
          <p><span>Question: </span>${question.body}</p>
          <p><span>Upvotes: </span>${question.upvotes}</p>
          <p><span>Downvotes: </span>${question.downvotes}</p>
          <p><span>Posted By: </span>${question.postedby} <span> On </span>${newDate}</p>
          <div class="actions">
            <span>Upvote</span><img src="images/upvoteicon.png"
            alt="upvote" id="up" data-id="${question.id}">
            <span>Downvote</span><img src="images/downvoteicon.png"
            alt="downvote" id="down" data-id="${question.id}">
            <span>${question.numbercomments} Comment(s)</span><a href="usercomments.html?id=${question.id}">
            <img src="images/edit.png" alt="comments"></a>
          </div>
        </div>
        `);
      }
    });
    const upvote = document.querySelectorAll('#up');
    const downvote = document.querySelectorAll('#down');
    upvote.forEach((btn) => {
      btn.addEventListener('click', fetchUpvote);
    });
    downvote.forEach((btn) => {
      btn.addEventListener('click', fetchDownvote);
    });
    const xcord = parseInt(localStorage.getItem('xcord'), 10);
    const ycord = parseInt(localStorage.getItem('ycord'), 10);
    if (xcord && ycord && ycord > 450) {
      window.scrollTo({
        top: ycord,
        left: xcord,
        behavior: 'smooth',
      });
      localStorage.removeItem('xcord');
      localStorage.removeItem('ycord');
    }
  },
  created: () => {
    const notFound = document.querySelector('.notfound');
    if (notFound) notFound.remove();
    questionForm.reset();
    submitBtn.disabled = false;
    submitBtn.value = 'Submit';
    closeModal();
    const questionsDiv = document.querySelectorAll('.questions');
    questionsDiv.forEach(qdiv => qdiv.remove());
    postDiv.insertAdjacentHTML('afterend', `
    <div class="notfound"><p>Question Posted Successfully.</p></div>
    `);
    const message = document.querySelector('.notfound');
    fetchQuestions();
    setTimeout(() => message.remove(), 2000);
  },
};

const fetchQuestions = async () => {
  await fetch(`${apiUrl}/questions/${meetupId}`, {
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
        return responses.notfound(errorData);
      }
      if (data.status === 200) {
        const questions = data.data;
        return responses.success(questions);
      }
      return true;
    })
    .catch(err => console.log(err));
};

const fetchPostQuestion = async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  const title = titleInput.value;
  const question = questionInput.value;
  const questionObject = {
    title, body: question, meetupid: e.target.dataset.id,
  };

  await fetch(`${apiUrl}/questions`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(questionObject),
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
    });
};

const fetchUpvote = async (e) => {
  const { id } = e.target.dataset;
  await fetch(`${apiUrl}/questions/${id}/upvote`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then((data) => {
      if (data.status === 400) {
        const errorData = data.error;
        return responses.voteErrors(errorData, e);
      }
      if (data.status === 200) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        localStorage.setItem('xcord', `${mouseX}`);
        localStorage.setItem('ycord', `${mouseY}`);
        window.location.reload();
      }
      return true;
    })
    .catch(err => console.log(err));
};

const fetchDownvote = async (e) => {
  const { id } = e.target.dataset;
  await fetch(`${apiUrl}/questions/${id}/downvote`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then((data) => {
      if (data.status === 400) {
        const errorData = data.error;
        return responses.voteErrors(errorData, e);
      }
      if (data.status === 200) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        localStorage.setItem('xcord', `${mouseX}`);
        localStorage.setItem('ycord', `${mouseY}`);
        window.location.reload();
      }
      return true;
    })
    .catch(err => console.log(err));
};

body.addEventListener('load', fetchQuestions());
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
questionForm.addEventListener('submit', fetchPostQuestion);
