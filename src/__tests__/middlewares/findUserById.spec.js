const { v4 } = require('uuid');

const {
  users,
  findUserById
} = require('../../');

let response;
let request;
let mockNext;

describe('findUserById', () => {
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

  it('deve ser capaz de encontrar o usuário pelo parâmetro de rota id e passá-lo para request.user', () => {
    const user = {
      id: v4(),
      name: 'Atlas',
      username: 'atlas',
      pro: false,
      todos: []
    };

    users.push(user);

    const mockRequest = request({ params: { id: user.id } });
    const mockUserSetter = jest.fn((userData) => { this.user = userData });
    mockRequest.__defineSetter__('user', mockUserSetter);

    const mockResponse = response();

    findUserById(mockRequest, mockResponse, mockNext);

    expect(mockUserSetter).toBeCalledWith(
      expect.objectContaining(user)
    );
    expect(mockNext).toBeCalled();
  });

  it('não deve ser capaz de passar o usuário para request.user quando ele não existe', () => {
    const mockRequest = request({ params: { id: v4() } });
    const mockUserSetter = jest.fn((userData) => { this.user = userData });
    mockRequest.__defineSetter__('user', mockUserSetter);

    const mockResponse = response();

    findUserById(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toBeCalledWith(404);

    expect(mockUserSetter).not.toBeCalled();
    expect(mockNext).not.toBeCalled();
  });
})