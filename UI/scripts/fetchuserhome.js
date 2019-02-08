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
          <button class="rsvp_yes" data-id="${meetup.id}">Yes</button>
          <button class="rsvp_no" data-id="${meetup.id}">No</button>
          <button class="rsvp_maybe" data-id="${meetup.id}">Maybe</button>
        </div>`;
        const newMeetupsLength = newMeetups.children.length;
        newMeetups.insertBefore(meetupNode, newMeetups.children[newMeetupsLength - 1]);
      });
      const rsvpYes = document.querySelectorAll('.rsvp_yes');
      const rsvpNo = document.querySelectorAll('.rsvp_no');
      const rsvpMaybe = document.querySelectorAll('.rsvp_maybe');
      rsvpYes.forEach((btn) => {
        btn.addEventListener('click', fetchRsvp);
      });
      rsvpNo.forEach((btn) => {
        btn.addEventListener('click', fetchRsvp);
      });
      rsvpMaybe.forEach((btn) => {
        btn.addEventListener('click', fetchRsvp);
      });
    } else {
      const meetupNode = createNode('div', 'new_one');
      meetupNode.style.marginBottom = '10px';
      meetupNode.innerHTML = '<p> No upcoming meetups found </p>';
      newMeetups.insertBefore(meetupNode, newMeetups.children[1]);
    }
    fetchJoinedMeetups();
  },
  joined: (meetups) => {
    meetups.reverse().forEach((meetup) => {
      fetchOneMeetup(meetup.meetupid);
    });
  },
  one: (result) => {
    const joinedNode = createNode('div', 'new_one');
    joinedNode.innerHTML = `<p>TOPIC: ${result.topic}</p>
    <p>DATE: ${result.happeningon}</p>
    <p>${result.joinedUsers} user(s) have joined this meetup.</p>
    <div class="rsvp">
      <a href="userview.html?id=${result.id}"><button>Meetup Details</button></a>
      <a href="usermeetups.html?id=${result.id}" data-id="${result.id}"><button>Questions</button></a>
    </div>`;
    newJoined.insertBefore(joinedNode, newJoined.children[1]);
    const questionBtn = document.querySelector(`a[data-id="${result.id}"]`);
    questionBtn.addEventListener('click', () => {
      localStorage.setItem('meetuptopic', result.topic);
    });
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
        const meetups = data.data.reverse();
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

const fetchRsvp = async (e) => {
  const { id } = e.target.dataset;
  const response = e.target.className.split('_')[1];
  const responseObject = { response };

  await fetch(`${apiUrl}/meetups/${id}/rsvps`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(responseObject),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then((data) => {
      if (data.status === 200) {
        const rsvpNode = createNode('div', 'new_one');
        rsvpNode.style.marginTop = '5px';
        rsvpNode.style.textAlign = 'center';
        rsvpNode.innerHTML = `<p> ${data.message} </p>`;
        body.insertBefore(rsvpNode, body.children[1]);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    })
    .catch(err => console.log(err));
};

body.addEventListener('load', fetchUpcomingMeetups());
logout.addEventListener('click', () => {
  localStorage.clear();
});
