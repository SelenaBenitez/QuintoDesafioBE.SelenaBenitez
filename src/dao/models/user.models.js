<<<<<<< HEAD
// src/dao/models/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
=======
import mongoose from 'mongoose';
>>>>>>> 65e94491e06e2214180c8b49c15cb29fd3fb05db

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true
<<<<<<< HEAD
  },
  passwordHash: String
});

userSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
=======
  }
});

export const userModel = mongoose.model('User', userSchema);
>>>>>>> 65e94491e06e2214180c8b49c15cb29fd3fb05db
