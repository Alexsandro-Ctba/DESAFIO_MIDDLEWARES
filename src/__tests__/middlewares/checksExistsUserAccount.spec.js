const { v4 } = require('uuid');

const {
  users,
  checksExistsUserAccount
} = require('../../');

let response;
let request;
let mockNext;

describe('checksExistsUserAccount', () => {
  beforeEach(() => {
    users.splice(0, users.length);

    request = (params) => {
      return {
        ...params
      }
    };

    response = () => {
      const response = {}

      response.status = jest.fn((code) => {
        return {
          ...response,
          statusCode: code
        }
      });

      response.json = jest.fn((obj) => {
        return {
          ...response,
          body: obj
        }
      });

      return response;
    };

    mockNext = jest.fn();
  });

  it('deve ser capaz de encontrar o usuário por nome de usuário no cabeçalho e passá-lo para request.user', () => {
    users.push({
      id: v4(),
      name: 'Atlas',
      username: 'atlas',
      pro: false,
      todos: []
    });

    const mockUserSetter = jest.fn((userData) => { this.user = userData });

    const mockRequest = request({ headers: { username: 'atlas' } });
    mockRequest.__defineSetter__('user', mockUserSetter);

    const mockResponse = response();

    checksExistsUserAccount(mockRequest, mockResponse, mockNext);

    expect(mockNext).toBeCalled();
    expect(mockUserSetter).toBeCalledWith(
      expect.objectContaining({
        name: 'Atlas',
        username: 'atlas',
      })
    );

  });

  it('não deve ser capaz de encontrar um usuário inexistente pelo nome de usuário no cabeçalho', () => {
    const mockRequest = request({ headers: { username: 'non-existing-username' } });
    const mockResponse = response();

    checksExistsUserAccount(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toBeCalledWith(404);
  });
})