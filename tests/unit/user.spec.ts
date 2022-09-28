import bcrypt from 'bcrypt';
import errors from '../../src/errors/errorsThrow';
import userFactory from '../factories/userFactory';
import userRepository from '../../src/repositories/userRepository';
import userService from '../../src/services/userService';

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('POST /users/sign-up', () => {
  it('expect to not found email and insert a user', async () => {
    const user = userFactory.__createUser();

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
    jest.spyOn(userRepository, 'insert').mockResolvedValueOnce();

    await expect(
      userService.insert({ ...user, confirmPassword: user.password }),
    ).resolves.not.toThrow();

    expect(userRepository.findByEmail).toBeCalledWith(user.email);
    expect(userRepository.insert).toBeCalled();
  });

  it('expect to found email and throw conflict', async () => {
    const user = userFactory.__createUser();

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({
      id: 1,
      ...user,
      createdAt: new Date(),
    });

    jest.spyOn(userRepository, 'insert').mockResolvedValueOnce();

    await expect(
      userService.insert({ ...user, confirmPassword: user.password }),
    ).rejects.toEqual(errors.conflict('user', 'registered'));

    expect(userRepository.findByEmail).toBeCalledWith(user.email);
    expect(userRepository.insert).not.toBeCalled();
  });
});

describe('POST /users/sign-in', () => {
  it('expect to found a email and receive a token', async () => {
    const user = userFactory.__createUser();
    const token = userFactory.__genereateToken(1, user.name);

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({
      id: 1,
      ...user,
      createdAt: new Date(),
    });
    jest.spyOn(userService, 'generateValidToken').mockReturnValueOnce(token);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(true);

    const validToken = await userService.login({ email: user.email, password: user.password });

    expect(validToken).toEqual(token);
    expect(userRepository.findByEmail).toBeCalledWith(user.email);
    expect(bcrypt.compareSync).toBeCalled();
  });

  it('expect to not found email and throw not found', async () => {
    const user = userFactory.__createUser();

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);

    await expect(
      userService.login({ email: user.email, password: user.password }),
    ).rejects.toEqual(errors.notFound('user', 'users'));

    expect(userRepository.findByEmail).toBeCalledWith(user.email);
  });

  it('expect to receive a wrong password and throw a bad request', async () => {
    const user = userFactory.__createUser();

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce({
      id: 1,
      ...user,
      createdAt: new Date(),
    });
    jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false);

    await expect(
      userService.login({ email: user.email, password: user.password }),
    ).rejects.toEqual(errors.badRequest('Wrong password'));

    expect(userRepository.findByEmail).toBeCalledWith(user.email);
    expect(bcrypt.compareSync).toBeCalled();
  });
});
