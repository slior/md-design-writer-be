import { User } from "../users/user.entity";

export interface Document
{
    id: string;
    title: string;
    content: string;
    author : User;
    createdAt: Date;
    updatedAt: Date;
}