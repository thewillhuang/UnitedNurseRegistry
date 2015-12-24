import { tokens } from './setToken';
let token = {};
if (!sessionStorage.getItem('token')) {
  token = tokens.token;
} else {
  token = { Authorization: sessionStorage.getItem('token') };
}
export default token;
