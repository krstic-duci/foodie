import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";

import { graphql } from "../__generated__/gql";

export const GET_BOOKS = graphql(`
  query GetBooks {
    getBooks {
      title
      author
    }
  }
`);

function DisplayBooks() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  if (!data?.getBooks) return null;

  return (
    <>
      {data.getBooks.map((book, index: number) => (
        <div key={index}>
          <h3>Author: {book?.author}</h3>
          <Typography>Book title: {book?.title}</Typography>
        </div>
      ))}
    </>
  );
}

export default DisplayBooks;
