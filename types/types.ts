export type Template = {
    name: string;
    id: string;
    text: string;
    variables: Variable[];
    email: string;
}

export type Variable = {
    name: string;
    value: string;
    id: string;
    color: string;
}