import { Expose } from "class-transformer";

export class UserResponeDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    age: number;

    @Expose()
    gender: string;

    @Expose()
    role: string;
}