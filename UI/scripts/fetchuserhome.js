const windowUrlArray = window.location.href.split('/');
windowUrlArray.pop();
const windowUrl = windowUrlArray.join('/');
let apiUrl = 'http://localhost:3000/api/v1';
if (window.location.href.split('.').includes('github')) {
  apiUrl = 'https://drizzyquestioner.herokuapp.com/api/v1';
}

const token = localStorage.getItem('token');
const { body } = window.document;
const newMeetups = document.querySelector('.new_meetups');
const newJoined = document.querySelector('.joined');
const logout = document.querySelector('.logout');

const createNode = (element, className) => {
  const newElement = document.createElement(element);
  newElement.setAttribute('class', className);
  return newElement;
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
  upcoming: (meetups) => {
    if (meetups.length > 0) {
      meetups.forEach((meetup) => {
        const meetupNode = createNode('div', 'new_one');
        meetupNode.innerHTML = `<p>TOPIC: ${meetup.topic}</p>
        <p>DATE: ${meetup.happeningon}</p>
        <p>Location: ${meetup.location}</p>
        <div class="rsvp">
          <span>RSVP: </span>
          <button class="rsvp_btn" data-id="${meetup.id}">Yes</button>
          <button class="rsvp_btn" data-id="${meetup.id}">No</button>
          <button class="rsvp_btn" data-id="${meetup.id}">Maybe</button>
        </div>`;
        const newMeetupsLength = newMeetups.children.length;
        newMeetups.insertBefore(meetupNode, newMeetups.children[newMeetupsLength - 1]);
      });
    } else {
      const meetupNode = createNode('div', 'new_one');
      meetupNode.innerHTML = '<p> No upcoming meetups found </p>';
      newMeetups.insertBefore(meetupNode, newMeetups.children[2]);
    }
    fetchJoinedMeetups();
  },
  joined: (meetups) => {
    meetups.forEach((meetup) => {
      fetchOneMeetup(meetup.meetupid);
    });
  },
  one: (result) => {
    const joinedNode = createNode('div', 'new_one');
    joinedNode.innerHTML = `<p>TOPIC: ${result.topic}</p>
    <p>DATE: ${result.happeningon}</p>
    <p>${result.joinedUsers} users have joined this meetup.</p>
    <div class="rsvp">
      <a href="userview.html?id=${result.id}"><button>Meetup Details</button></a>
      <a href="usermeetups.html?id=${result.id}"><button>Questions</button></a>
    </div>`;
    newJoined.insertBefore(joinedNode, newJoined.children[1]);
  },
};

const fetchUpcomingMeetups = async () => {
  await fetch(`${apiUrl}/meetups/upcoming`, {
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
        return responses.upcoming(meetups);
      }
      return true;
    })
    .catch(err => console.log(err));
};

const fetchJoinedMeetups = async () => {
  await fetch(`${apiUrl}/meetups/rsvps`, {
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
        const meetups = data.data;
        return responses.joined(meetups);
      }
      return true;
    })
    .catch(err => console.log(err));
};

const fetchOneMeetup = async (id) => {
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
        const result = data.data;
        return responses.one(result);
      }
      return true;
    })
    .catch(err => console.log(err));
};

body.addEventListener('load', fetchUpcomingMeetups());
logout.addEventListener('click', () => {
  localStorage.clear();
});
