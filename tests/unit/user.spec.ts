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
