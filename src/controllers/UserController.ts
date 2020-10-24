import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import * as Yup from 'yup';
import argon2 from 'argon2';

import { User } from '@models/User';
import UserView from '@views/users_view';

export default {
  async create(req: Request, res: Response) {
    const { email, name, password, age } = req.body;
    const usersRepository = getRepository(User);

    const isInUse = await usersRepository.findOne({ where: { email } });

    if (isInUse) {
      return res.status(404).json({ message: 'Email already in use' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      password: Yup.string().required().min(8),
      email: Yup.string().required().email(),
      age: Yup.number().required(),
    });

    await schema.validate(
      { name, password, email, age },
      {
        abortEarly: false,
      }
    );

    const hashedPassword = await argon2.hash(password);

    const data = {
      name,
      age,
      email,
      password: hashedPassword,
    };

    const user = usersRepository.create(data);

    await usersRepository.save(user);

    return res.status(201).json(UserView.render(user));
  },
  async index(req: Request, res: Response) {
    const usersRepository = getRepository(User);
    const users = await usersRepository.find();

    return res.status(200).json(UserView.renderMany(users));
  },
  async show(req: Request, res: Response) {
    const { id } = req.params;
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne(id);

    return res.status(200).json(UserView.render(user));
  },
  async delete(req: Request, res: Response) {},
  async update(req: Request, res: Response) {},
};
