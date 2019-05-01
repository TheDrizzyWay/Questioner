const questionId = parseInt(window.location.href.split('=')[1], 10);
let apiUrl = 'http://localhost:3000/api/v1';
if (window.location.href.split('.').includes('github')) {
  apiUrl = 'https://drizzyquestioner.herokuapp.com/api/v1';
}

const token = localStorage.getItem('token');
const meetupTopic = localStorage.getItem('meetuptopic');
const postDiv = document.querySelector('.add');
const topicSpan = document.querySelector('#topic-span');
const questionSpan = document.querySelector('#question-span');
const container = document.querySelector('.container');
const simpleModal = document.getElementById('simple-modal');
const modalBtn = document.getElementById('modal-button');
const closeBtn = document.querySelector('.close_btn');
const commentForm = document.querySelector('#comment-form');
const commentInput = document.querySelector('#comment');
const submitBtn = document.querySelector('#submit');
commentForm.setAttribute('data-id', questionId);
const backBtn = document.querySelector('#back');
const js = 'javascript';
backBtn.href = `${js}:history.go(-1)`;
const { body } = window.document;

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

const loadSpinner = (element) => {
  const spinner = document.querySelector('.spinner');
  if (spinner) {
    spinner.remove();
    return;
  }
  element.insertAdjacentHTML('beforebegin', '<div class="spinner"></div>');
};

const responses = {
  notfound: (errorData) => {
    postDiv.insertAdjacentHTML('afterend', `
    <div class="notfound"><p>${errorData}</p></div>
    `);
  },
  success: (comments) => {
    if (comments.paginatedResult.length === 0) {
      container.insertAdjacentHTML('afterbegin', `
      <div class="notfound"><p>No questions found.</p>
      </div>`);
      return;
    }
    topicSpan.innerHTML = meetupTopic;
    questionSpan.innerHTML = `QUESTION: ${comments[0].body}`;
    comments.paginatedResult.forEach((comment) => {
      const newDate = convertDate(comment.createdon);
      container.insertAdjacentHTML('afterbegin', `
      <div class="questions">
        <p><span>Comment: </span>${comment.comment}</p>
        <p><span>Posted By: </span>${comment.postedby} <span> On </span>${newDate}</p>
      </div>
      `);
    });
  },
  created: () => {
    const notFound = document.querySelector('.notfound');
    if (notFound) notFound.remove();
    commentForm.reset();
    submitBtn.disabled = false;
    submitBtn.value = 'Submit';
    closeModal();
    const commentsDiv = document.querySelectorAll('.questions');
    commentsDiv.forEach(cdiv => cdiv.remove());
    fetchComments();
  },
};

const fetchComments = async () => {
  loadSpinner(postDiv);
  await fetch(`${apiUrl}/comments/${questionId}`, {
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
        return responses.notfound(errorData);
      }
      if (data.status === 200) {
        loadSpinner();
        const comments = data.data;
        return responses.success(comments);
      }
      return true;
    })
    .catch((err) => {
      loadSpinner();
      console.log(err);
    });
};

const fetchPostComment = async (e) => {
  e.preventDefault();
  loadSpinner(submitBtn);
  submitBtn.disabled = true;
  submitBtn.value = 'Please wait...';
  const comment = commentInput.value;
  const commentObject = {
    questionid: e.target.dataset.id, comment,
  };

  await fetch(`${apiUrl}/comments`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(commentObject),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then((data) => {
      loadSpinner();
      if (data.status === 201) return responses.created();
      return true;
    })
    .catch((err) => {
      loadSpinner();
      console.log(err);
      submitBtn.disabled = false;
    });
};

body.addEventListener('load', fetchComments());
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
commentForm.addEventListener('submit', fetchPostComment);
