import axios from 'axios';

const instance = axios.create({
  headers: {
    Accept: 'application/json',
  },
});

const unauthorizedPaths = ['/forgot', '/login', '/reset', '/twoFactor'];
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && !unauthorizedPaths.includes(window.location.pathname)) {
      window.location = '/login';
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
  clients: {
    index() {
      return instance.get('/api/clients/');
    },
    create(data) {
      return instance.post(`/api/clients`, data);
    },
    get(id) {
      return instance.get(`/api/clients/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/clients/${id}`, data);
    },
    regenerate(id) {
      return instance.patch(`/api/clients/${id}/regenerate`);
    },
    delete(id) {
      return instance.delete(`/api/clients/${id}`);
    },
  },
  emsCalls: {
    getDispatchCallNumbers(ambulanceIdentifier) {
      return instance.get('/api/emscalls/dispatch-call-numbers', { params: { ambulanceIdentifier } });
    },
  },
  hospitals: {
    index(params) {
      const { organizationId } = params ?? {};
      return instance.get('/api/hospitals/', { params: { organizationId } });
    },
    create(data) {
      return instance.post(`/api/hospitals`, data);
    },
    get(id) {
      return instance.get(`/api/hospitals/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/hospitals/${id}`, data);
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
  hospitalUsers: {
    index(params) {
      const { hospitalId, userId } = params ?? {};
      return instance.get('/api/hospitalusers', { params: { hospitalId, userId } });
    },
    create(data) {
      return instance.post(`/api/hospitalusers`, data);
    },
    update(id, data) {
      return instance.patch(`/api/hospitalusers/${id}`, data);
    },
  },
  mcis: {
    index() {
      return instance.get('/api/mcis');
    },
    create(data) {
      return instance.post('/api/mcis', data);
    },
    get(id) {
      return instance.get(`/api/mcis/${id}`);
    },
    ringdowns(id) {
      return instance.get(`/api/mcis/${id}/ringdowns`);
    },
    update(id, data) {
      return instance.patch(`/api/mcis/${id}`, data);
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
      const { organizationId, hospitalId, search } = params || {};
      return instance.get('/api/users/', { params: { organizationId, hospitalId, search } });
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
    create(data) {
      return instance.post(`/api/organizations`, data);
    },
    get(id) {
      return instance.get(`/api/organizations/${id}`);
    },
    update(id, data) {
      return instance.patch(`/api/organizations/${id}`, data);
    },
  },
  auth: {
    login(params) {
      return instance.post('/auth/local/login', params);
    },
    twoFactor(params) {
      return instance.post('/auth/local/twoFactor', params);
    },
    forgot(params) {
      return instance.post('/auth/local/forgot', params);
    },
    reset(params) {
      return instance.post('/auth/local/reset', params);
    },
  },
};
