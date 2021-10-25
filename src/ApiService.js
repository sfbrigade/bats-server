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
  ambulances: {
    getIdentifiers(organizationId) {
      return instance.get('/api/ambulances/identifiers', { params: { organizationId } });
    },
  },
  emsCalls: {
    getDispatchCallNumbers(ambulanceIdentifier) {
      return instance.get('/api/emscalls/dispatch-call-numbers', { params: { ambulanceIdentifier } });
    },
  },
  hospitalStatuses: {
    get() {
      return instance.get('/api/hospitalstatuses');
    },
    create(data) {
      return instance.post('/api/hospitalstatuses', data);
    },
  },
  ringdowns: {
    create(data) {
      return instance.post('/api/ringdowns', data);
    },
    get(hospitalId) {
      return instance.get('/api/ringdowns', { params: { hospitalId } });
    },
    mine() {
      return instance.get('/api/ringdowns/mine');
    },
    setDeliveryStatus(patientDeliveryId, deliveryStatus, dateTimeLocal) {
      return instance.patch(`/api/ringdowns/${patientDeliveryId}/deliveryStatus`, { deliveryStatus, dateTimeLocal });
    },
    update(patientDeliveryId, data) {
      return instance.patch(`/api/ringdowns/${patientDeliveryId}`, data);
    },
  },
  users: {
    me() {
      return instance.get('/api/users/me');
    },
    all() {
      return instance.get('/api/users/');
    },
    create(data) {
      return instance.post('/api/users/', data);
    },
    update(data) {
      return instance.put('/api/users/', data);
    },
    deleteUser(data) {
        return instance.delete('/api/users/remove', {params: {data}});
    }
  },
  orgs: {
    // this may not be needed will keep for now
    all() {
      return instance.get('/api/organizations/');
    },
  },
};
