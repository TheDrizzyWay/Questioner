const windowArray = window.location.href.split('/');
const currentPage = windowArray.pop();
const newWindowUrl = windowArray.join('/');

const checkSignup = () => {
  const token = localStorage.getItem('token');
  const isadmin = localStorage.getItem('isadmin');
  if (token && isadmin) {
    if (isadmin === 'true') {
      window.location.href = `${newWindowUrl}/adminhome.html`;
    } else {
      window.location.href = `${newWindowUrl}/userhome.html`;
    }
  }
};

const checkLogin = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('isadmin');
  const validRoles = ['true', 'false'];
  if (!validRoles.includes(userRole) || !token) {
    localStorage.clear();
    window.location.href = `${newWindowUrl}/signin.html`;
  }
};

const adminOnly = () => {
  const isadmin = localStorage.getItem('isadmin');
  if (isadmin !== 'true') window.location.href = `${newWindowUrl}/userhome.html`;
};

switch (currentPage) {
  case 'adminhome.html':
    adminOnly();
    checkLogin();
    break;
  case 'adminview.html':
    adminOnly();
    checkLogin();
    break;
  case 'profile.html':
    checkLogin();
    break;
  case 'usercomments.html':
    checkLogin();
    break;
  case 'userhome.html':
    checkLogin();
    break;
  case 'usermeetups.html':
    checkLogin();
    break;
  case 'userview.html':
    checkLogin();
    break;
  case 'signup.html':
    checkSignup();
    break;
  default:
    break;
}
