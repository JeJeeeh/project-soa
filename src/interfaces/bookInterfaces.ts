export interface IBooks{
  data: IBookData[];
}

export interface IBook {
  data: IBookData;
}

export interface IBookData {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
  chapters: IBooksChapter[]
}

interface IBooksChapter {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  reference: string;
}