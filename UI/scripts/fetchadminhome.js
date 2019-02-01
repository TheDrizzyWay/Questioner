const windowUrlArray = window.location.href.split('/');
windowUrlArray.pop();
const windowUrl = windowUrlArray.join('/');
let apiUrl = 'http://localhost:3000/api/v1';
if (window.location.href.split('.').includes('github')) {
  apiUrl = 'https://drizzyquestioner.herokuapp.com/api/v1';
}
const meetContainer = document.querySelector('.meet_container');
const meetupList = [];
const logout = document.querySelector('.logout');
const { body } = window.document;
const createNode = (element, className) => {
  const newElement = document.createElement(element);
  newElement.setAttribute('class', className);
  return newElement;
};
const appendNewNode = (parent, element) => parent.insertBefore(element, parent.firstChild);

const responses = {
  errors: (errorData) => {
    console.log(errorData);
    if (errorData.includes('Unauthorized')
  || errorData.includes('Log')
  || errorData.includes('verifying')) {
      localStorage.clear();
      window.location.href = `${windowUrl}/signin.html`;
    }
  },
  success: (meetups) => {
    meetups.forEach((meetup) => {
      meetupList.push(meetup);
      const meetupNode = createNode('div', 'meet');
      meetupNode.innerHTML = `<img src="images/meeting2.jpg" alt="location.jpg">
      <p>TOPIC: ${meetup.topic}</p>
      <p>DATE: ${meetup.happeningon}</p>
      <a href="adminview.html"><button>View</button></a>`;
      appendNewNode(meetContainer, meetupNode);
    });
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
    })
    .catch(err => console.log(err));
};

body.addEventListener('load', fetchMeetups());
logout.addEventListener('click', () => {
  localStorage.clear();
});
