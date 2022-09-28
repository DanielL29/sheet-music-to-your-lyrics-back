import { Request, Response } from 'express';
import userService from '../services/userService';
import { UserInsertData, UserLogin } from '../types/userType';

async function insert(req: Request, res: Response) {
  const user: UserInsertData = req.body;

  await userService.insert(user);

  res.sendStatus(201);
}

async function login(req: Request, res: Response) {
  const user: UserLogin = req.body;

  const token: string = await userService.login(user);

  res.status(200).send({ token });
}

const userController = {
  insert,
  login,
};

export default userController;
