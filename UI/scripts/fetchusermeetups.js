const meetupId = parseInt(window.location.href.split('=')[1], 10);
let apiUrl = 'http://localhost:3000/api/v1';
if (window.location.href.split('.').includes('github')) {
  apiUrl = 'https://drizzyquestioner.herokuapp.com/api/v1';
}

const token = localStorage.getItem('token');
const postDiv = document.querySelector('.add');
const container = document.querySelector('.container');
const topicSpan = document.querySelector('#topic-span');
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


const responses = {
  notfound: (errorData) => {
    postDiv.insertAdjacentHTML('afterend', `
    <div class="notfound">
    <p>${errorData}</p>
    </div>
    `);
  },
  success: (questions) => {
    if (questions.length === 0) {
      container.insertAdjacentHTML('afterbegin', `
      <div class="notfound"><p>No questions found.</p>
      </div>`);
      return;
    }
    topicSpan.innerHTML = questions[0].topic;
    questions.forEach((question) => {
      const newDate = convertDate(question.createdon);
      container.insertAdjacentHTML('afterbegin', `
      <div class="questions">
        <p><span>Question: </span>${question.body}</p>
        <p><span>Upvotes: </span>${question.upvotes}</p>
        <p><span>Downvotes: </span>${question.downvotes}</p>
        <p><span>Posted By: </span>${question.postedby}</p>
        <p><span>Posted On: </span>${newDate}</p>
        <div class="actions">
          <span>Upvote</span><img src="images/upvoteicon.png" alt="upvote" data-id="${question.id}">
          <span>Downvote</span><img src="images/downvoteicon.png" alt="downvote" data-id="${question.id}">
          <span>Comments</span><a href="usercomments.html?id=${question.id}">
          <img src="images/edit.png" alt="comments"></a>
        </div>
      </div>
      `);
    });
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


body.addEventListener('load', fetchQuestions());
