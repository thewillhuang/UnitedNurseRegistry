const setToken = (token, user) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user));
  console.log(sessionStorage.getItem('token'));
};
export default setToken;
