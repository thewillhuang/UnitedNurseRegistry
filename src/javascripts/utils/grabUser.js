import { tokens } from './setToken';
let user = {};
if (!sessionStorage.getItem('user')) {
  JSON.parse(tokens.user);
} else {
  user = JSON.parse(sessionStorage.getItem('user'));
}
console.log(user);
export default user;
