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
    index(params) {
      const { organizationId, hospitalId } = params || {};
      return instance.get('/api/users/', { params: { organizationId, hospitalId } });
    },
    active(params) {
      const { organizationId, hospitalId } = params || {};
      return instance.get('/api/users/active', { params: { organizationId, hospitalId } });
    },
    create(data) {
      return instance.post('/api/users/', data);
    },
    get(id, params) {
      const { organizationId, hospitalId } = params || {};
      return instance.get(`/api/users/${id}`, { params: { organizationId, hospitalId } });
    },
    update(id, data) {
      return instance.patch(`/api/users/${id}`, data);
    },
    delete(id) {
      return instance.delete(`/api/users/${id}`);
    },
  },
  organizations: {
    index() {
      return instance.get('/api/organizations/');
    },
    get(id) {
      return instance.get(`/api/organizations/${id}`);
    }
  },
};
