export const tokens = {};
const setToken = (token, user) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user));
  tokens.token = token;
  tokens.user = JSON.stringify(user);
  console.log(sessionStorage.getItem('token'));
};

export default setToken;
