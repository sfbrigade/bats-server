class User {
  constructor(payload) {
    this.payload = payload || {};
    this.payload.firstName = this.payload.firstName || '';
    this.payload.lastName = this.payload.lastName || '';
    this.payload.email = this.payload.email || '';
    this.payload.password = this.payload.password || '';
    this.payload.isOperationalUser = this.payload.isOperationalUser || true;
    this.payload.isAdminUser = this.payload.isAdminUser || false;
    this.payload.isAdminUser = this.payload.isAdminUser || false;
  }

  get firstName() {
    return this.payload.firstName;
  }

  set firstName(newValue) {
    this.payload.firstName = newValue;
  }

  get lastName() {
    return this.payload.lastName;
  }

  set lastName(newValue) {
    this.payload.lastName = newValue;
  }

  get email() {
    return this.payload.email;
  }

  set email(newValue) {
    this.payload.email = newValue;
  }

  get password() {
    return this.payload.password;
  }

  set password(newValue) {
    this.payload.password = newValue;
  }

  get isAdmin() {
    return this.payload.isAdminUser;
  }

  set isAdmin(newValue) {
    this.payload.isAdminUser = newValue;
  }

  get isOperational() {
    return this.payload.isOperational;
  }

  set isOperational(newValue) {
    this.payload.isOperational = newValue;
  }

  get isUserValid() {
    return (
      this.firstName !== null &&
      this.firstName !== '' &&
      this.lastName !== null &&
      this.lastName !== '' &&
      this.email !== null &&
      this.email !== '' &&
      this.password !== null &&
      this.password !== ''
    );
  }

  toJson() {
    return this.payload;
  }
}

export default User;
