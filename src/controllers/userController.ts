import { Request, Response } from 'express';
import userService from '../services/userService';
import { UserInsertData, UserLocal, UserLogin } from '../types/userType';

async function insert(req: Request, res: Response) {
  const user: UserInsertData = req.body;

  await userService.insert(user);

  res.sendStatus(201);
}

async function login(req: Request, res: Response) {
  const user: UserLogin = req.body;

  const userLocal: UserLocal = await userService.login(user);

  res.status(200).send(userLocal);
}

async function makeContributor(req: Request, res: Response) {
  const { email } = req.params;

  const userLocal: UserLocal = await userService.makeUserContributor(email);

  res.status(200).send(userLocal);
}

async function sendEmailToContributor(req: Request, res: Response) {
  const userEmail: string = res.locals.user.email;

  await userService.sendEmailToContributor(userEmail);

  res.sendStatus(200);
}

const userController = {
  insert,
  login,
  makeContributor,
  sendEmailToContributor,
};

export default userController;
