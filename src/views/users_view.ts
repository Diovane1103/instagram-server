import { User } from '@models/User';

export default {
  render(user: User) {
    const { name, age, email, id } = user;
    return { name, email, id, age };
  },
  renderMany(users: User[]) {
    return users.map((user) => this.render(user));
  },
};
