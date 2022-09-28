import { Request, Response } from 'express';
import userService from '../services/userService';
import { UserInsertData } from '../types/userType';

async function insert(req: Request, res: Response) {
  const user: UserInsertData = req.body;

  await userService.insert(user);

  res.sendStatus(201);
}

const userController = {
  insert,
};

export default userController;
