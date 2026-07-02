import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @IsString()
  @MinLength(2)
  identifier!: string;

  @IsString()
  @MinLength(1)
  password!: string;

  /** Browser GPS — only sent if user allows location permission */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  location_accuracy?: number;

  /** Outreach email tracking id from ?wftref= on demo link */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  outreach_ref?: string;
}
