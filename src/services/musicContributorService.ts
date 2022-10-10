import musicContributorRepository from '../repositories/musicContributorRepository';

async function contributorsByMusic(musicName: string) {
  return musicContributorRepository.contributorsByMusic(musicName);
}

const musicContributorService = {
  contributorsByMusic,
};

export default musicContributorService;
