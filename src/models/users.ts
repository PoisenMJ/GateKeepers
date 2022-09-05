import mongoose from 'mongoose';
import crypto from 'crypto';

interface UserSchema {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  lastPasswordChange: Date;
  key?: string;
  fullName: string;
  checkPassword: (inputString: string) => boolean;
  changePassword: (newPassword: string) => void;
}

const schema = new mongoose.Schema<UserSchema>({
  username: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  firstName: {
    type: String,
    require: false
  },
  lastName: {
    type: String,
    require: false
  },
  password: {
    type: String,
    require: true
  },
  lastPasswordChange: {
    type: Date,
    require: false
  },
  key: String
}, {
  virtuals: {
    fullName: {
      get() {
        if(this.firstName && this.lastName)
          return this.firstName + " " + this.lastName;
        else return "";
      }
    }
  },
  methods: {
    checkPassword(inputPassword: string) {
      const hashedInputPassword = crypto.createHash("md5").update(inputPassword).digest("hex");
      if(hashedInputPassword === this.password) return true;
      else return false;
    },
    changePassword(newPassword: string) {
      const hashedNewPassword = crypto.createHash("md5").update(newPassword).digest("hex");
      this.password = hashedNewPassword;
    }
  }
});

schema.pre('save', async function(next) {
  const inputPassword = this.password;
  const hashedInputPassword = crypto.createHash("md5").update(inputPassword).digest("hex");
  this.password = hashedInputPassword;
  return next();
});

const User = mongoose.model<UserSchema>('Users', schema);

export { UserSchema };

export default User;