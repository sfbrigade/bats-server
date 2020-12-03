import axios from 'axios';

const instance = axios.create({
  headers: {
    Accept: 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      window.location = '/auth/local/login';
    }
    return Promise.reject(error);
  }
);

export default {
  hospitalStatuses: {
    get() {
      return instance.get('/api/hospitalstatuses');
    },
  },
  users: {
    me() {
      return instance.get('/api/users/me');
    },
  },
};
