import HttpStatus from 'http-status-codes';

class FormError extends Error {
  constructor(error) {
    super();
    if (error.response?.status === HttpStatus.UNPROCESSABLE_ENTITY) {
      this.data = error.response.data;
    }
  }

  get message() {
    if (this.data) {
      return 'Please review the errors below.';
    }
    return 'An unexpected error has occurred. Please try again later.';
  }

  errorsFor(name) {
    const errors = this.data?.messages?.filter((e) => e.path === name);
    return errors?.length ? errors : null;
  }
}

export default FormError;
