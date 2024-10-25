import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

// Mock implementations
const mockUsersService =
{
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService =
{
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      'jwt.secret': 'test-secret',
      'jwt.expiresIn': '1h',
      'auth.saltRounds': 10
    };
    return config[key];
  }),
};

describe('AuthService', () =>
{
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () =>
  {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const testUser = 
      {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      mockUsersService.findByEmail.mockResolvedValue(testUser);

      const result = await authService.validateUser('test@example.com', 'password123');

      expect(result).toBeDefined();
      expect(result.id).toBe(testUser.id);
      expect(result.email).toBe(testUser.email);
      expect(result.password).toBeUndefined(); // Password should be removed
    });

    it('should return null when user is not found', async () =>
    {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser('nonexistent@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () =>
    {
      const testUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      mockUsersService.findByEmail.mockResolvedValue(testUser);

      const result = await authService.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () =>
  {
    it('should generate JWT token for valid user', async () =>
    {
      const testUser = {
        id: 1,
        email: 'test@example.com',
      };

      const testToken = 'test.jwt.token';
      mockJwtService.sign.mockReturnValue(testToken);

      const result = await authService.login(testUser);

      expect(result.access_token).toBe(testToken);
      expect(jwtService.sign).toHaveBeenCalledWith({ 
        email: testUser.email, 
        sub: testUser.id 
      });
      // expect(configService.get).toHaveBeenCalledWith('jwt.secret');
      expect(configService.get).toHaveBeenCalledWith('auth.jwt.expiresIn');
    });
  });
});

describe('AuthController', () =>
{
  let controller: AuthController;
  let authService: AuthService;
  let configService : ConfigService;

  beforeEach(async () =>
  {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            validateUser: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('login', () =>
  {
    it('should return JWT token on successful login', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        access_token: 'test.jwt.token',
        expiresIn : '1h'
      };

      (authService.validateUser as jest.Mock).mockResolvedValue(loginDto);
      (authService.login as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await controller.login({ password: 'password123', email: loginDto.email });

      expect(result).toEqual(expectedResponse);
      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password)
      expect(authService.login).toHaveBeenCalledWith({ password: loginDto.password, email: loginDto.email });

    });
  });
});