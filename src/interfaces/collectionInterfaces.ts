export interface IBodyCollection {
    name: string;
    description: string;
    image: string;
}

export interface IDataCollection {
    name: string;
    description: string;
    userId: number;
}

export interface IQueryGetCollection {
    id: number;
}

export interface IUpdateCollection {
    id: number;
    name: string;
    description: string;
}
