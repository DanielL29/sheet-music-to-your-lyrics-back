import bcrypt from 'bcrypt';

interface HashLiterals {
  encrypt: (password: string) => string
  compare: (password: string, hashPassword: string) => boolean
}

const hash: HashLiterals = {
  encrypt: (password: string) => bcrypt.hashSync(password, 10),
  compare: (password: string, hashPassword: string) => bcrypt.compareSync(password, hashPassword),
};

export default hash;
