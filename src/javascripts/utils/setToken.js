const setToken = (token, user) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', user);
};
export default setToken;
