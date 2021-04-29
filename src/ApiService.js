import axios from 'axios';
import Ringdown from './Models/Ringdown';
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
    cancel(patientDeliveryId, dateTimeLocal) {
      return instance.patch(`/api/ringdowns/${patientDeliveryId}/deliveryStatus`, {deliveryStatus: Ringdown.Status.CANCELLED, dateTimeLocal});
    },
   
  },
  users: {
    me() {
      return instance.get('/api/users/me');
    },
  },
};
