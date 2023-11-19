import bcrypt from 'bcrypt';

class User {
  constructor(first_name, last_name, email, age, password, cartId, role = 'user') {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.age = age;
    this.password = password;
    this.cartId = cartId;
    this.role = role;
    this.resetPasswordToken = null;
    this.resetPasswordExpiration = null;
  }

  async save() {
    // Hash de la contraseña antes de guardar
    this.password = await bcrypt.hash(this.password, 10);
  }
}

export default User;
