import { ContentType } from '../helpers/contentType';

interface IVerses {
  data: IVersesData[];
}

interface IVerse {
  data: IVerseData;
}

interface IVersesData {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  reference: string;
}

interface IVerseData {
  id: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright: string;
  next: {
    id: string;
    bookId: string;
  },
  previous: {
    id: string;
    bookId: string;
  },
}

interface IQueryVerse {
  "content-type"?: ContentType;
  "include-notes"?: boolean;
  "include-titles"?: boolean;
  "include-chapter-numbers"?: boolean;
  "include-verse-numbers"?: boolean;
  "include-verse-spans"?: boolean;
  "parallels"?: string;
  "use-org-id"?: boolean;
}

export { IVerses, IVerse, IVersesData, IVerseData, IQueryVerse };