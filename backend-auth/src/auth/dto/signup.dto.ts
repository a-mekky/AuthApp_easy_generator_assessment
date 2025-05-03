import { CreateUserDto } from '../../users/dto/create-user.dto';

// Extend CreateUserDto for signup (as it includes the reqirements  (e.g. name, email, and password) in the current case)
export class SignupDto extends CreateUserDto {}
