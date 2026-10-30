import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  id!: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  email!: string;

  @ApiProperty({ example: 'Jane Doe' })
  name!: string;

  @ApiProperty({ example: '2026-10-30T17:00:00.000Z', required: false })
  createdAt?: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Bearer access token',
  })
  accessToken!: string;

  @ApiProperty({ type: UserProfileDto })
  user!: UserProfileDto;
}

