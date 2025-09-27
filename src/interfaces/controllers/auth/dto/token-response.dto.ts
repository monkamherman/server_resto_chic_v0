import { ApiProperty } from "@nestjs/swagger";

export class TokenResponseDto {
  @ApiProperty({
    description: "JWT Access Token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  accessToken!: string;

  @ApiProperty({
    description: "Refresh Token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    required: false,
  })
  refreshToken?: string;

  @ApiProperty({
    description: "Type de token",
    example: "Bearer",
  })
  tokenType: string = "Bearer";

  @ApiProperty({
    description: "Date d'expiration en secondes",
    example: 3600,
  })
  expiresIn!: number;

  constructor(partial: Partial<TokenResponseDto>) {
    Object.assign(this, partial);
  }
}
