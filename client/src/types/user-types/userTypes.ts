export type UserLoginFormData = {
    username: string;
    password: string;
}

export type User = {
    id?: string;
    name?: string;
    user?: string;
    username: string;
    password: string;
    token?: string;
    artisanName?: string;
    name_and_family: string;
    status: 'active' | 'inactive';
    role: 'user' | 'manager';
}