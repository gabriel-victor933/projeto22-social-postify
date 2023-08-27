import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsIn } from "class-validator"

export class CreatePublicationDto {
    @IsNumber()
    @IsNotEmpty()
    mediaId: number
    @IsNumber()
    @IsNotEmpty()
    postId: number
    @IsDateString()
    @IsNotEmpty()
    date: Date
}

export class QueryDto {
    @IsOptional()
    @IsIn(["true","false"])
    published: string
    @IsOptional()
    @IsDateString()
    after: Date
}