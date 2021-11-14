const { v4 } = require('uuid');

const {
  users,
  checksCreateTodosUserAvailability
} = require('../../');

let response;
let request;
let mockNext;

describe('checksCreateTodosUserAvailability', () => {
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

  it('deve ser capaz de permitir que o usuário crie uma nova tarefa quando estiver no plano livre e tiver menos de dez tarefas', () => {
    const mockRequest = request({
      user: {
        id: v4(),
        name: 'Atlas',
        username: 'atlas',
        pro: false,
        todos: []
      }
    });

    const mockResponse = response();

    checksCreateTodosUserAvailability(mockRequest, mockResponse, mockNext);

    expect(mockNext).toBeCalled();
  });

  it('não deve ser capaz de permitir que o usuário crie uma nova tarefa quando não for Pro e já tiver dez tarefas', () => {
    const mockRequest = request({
      user: {
        id: v4(),
        name: 'Atlas',
        username: 'atlas',
        pro: false,
        todos: Array.from({ length: 10 }, () => ({
          id: v4(),
          title: 'Todo',
          deadline: new Date(),
          done: false,
          created_at: new Date()
        }))
      }
    });

    const mockResponse = response();

    checksCreateTodosUserAvailability(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toBeCalledWith(403);
  });

  it('deve ser capaz de permitir que o usuário crie infinitas novas tarefas quando estiver no plano Pro', () => {
    const mockRequest = request({
      user: {
        id: v4(),
        name: 'Atlas',
        username: 'atlas',
        pro: true,
        todos: Array.from({ length: 10 }, () => ({
          id: v4(),
          title: 'Todo',
          deadline: new Date(),
          done: false,
          created_at: new Date()
        })),
      }
    });

    const mockResponse = response();

    checksCreateTodosUserAvailability(mockRequest, mockResponse, mockNext);

    expect(mockNext).toBeCalled();
  });
})