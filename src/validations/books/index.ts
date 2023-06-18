import booksSchema from "./booksValidation";
import bookSchema from "./bookValidation";
import IBookSchema from "../../interfaces/validationInterfaces/bookInterfaces";

const schema: IBookSchema = {
  booksSchema,
  bookSchema
}

export default schema;