import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;

  // Minimal mock of the Mongoose Model methods you use:
  const mockUserModel = {
    find: jest.fn().mockReturnThis(),
    findOne: jest
      .fn()
      .mockResolvedValue({ id: '123', email: 'test@example.com' }),
    create: jest
      .fn()
      .mockResolvedValue({ id: '123', email: 'test@example.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
