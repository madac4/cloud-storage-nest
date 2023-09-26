import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    type: String,
    default: 'example@stellarsolutions.md',
  })
  email: string;
  @ApiProperty({
    required: true,
    type: String,
    default: 'John Doe',
  })
  name: string;
  @ApiProperty({
    required: true,
    type: String,
    default: 'your-password',
  })
  password: string;
}
