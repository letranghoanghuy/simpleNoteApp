export default class User {
    key?: string | null;
    name?: string;
    password?: string;
    code?: string;
    image?: string;
    notes?:Note[];
}

export class Note{
    key?: string | null;
    title?: string;
    content?: string;
    date?: string;
}
