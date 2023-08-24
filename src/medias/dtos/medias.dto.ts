import { IsNotEmpty, IsString, IsUrl } from "class-validator"

export class CreateMediaDto {
    @IsString()
    @IsNotEmpty()
    title: string
    @IsUrl()
    @IsNotEmpty()
    username: string
}