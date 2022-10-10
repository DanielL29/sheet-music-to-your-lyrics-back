import { Request, Response } from 'express';
import musicContributorService from '../services/musicContributorService';

async function contributorsByMusic(req: Request, res: Response) {
  const { musicName } = req.params;

  const contributors = await musicContributorService.contributorsByMusic(musicName);

  res.status(200).send({ contributors });
}

const musicContributorController = {
  contributorsByMusic,
};

export default musicContributorController;
