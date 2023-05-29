export interface IItemsParams {
    collectionId?: string;
    itemId?: string;
}

export interface IBodyItem {
    bibleId: string;
    verseId: string;
}

export interface IDataItem {
    collectionId: number;
    bibleId: string;
    bookId: string;
    chapterId: string;
    content: string;
    title: string;
    verseId: string;
}

export interface IItem {
    id: number;
    title: string;
    bibleId: string;
    bookId: string;
    chapterId: string;
    verseId: string;
    content: string;

    createdAt?: Date;
    updatedAt?: Date;
    collectionId?: number;
}