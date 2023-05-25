import { useQuery } from "@apollo/client";

import { gql } from "../__generated__/gql";

export const GET_BOOKS = gql(/* GraphQL */ `
  query GetBooks {
    books {
      title
      author
    }
  }
`);

function DisplayBooks() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  if (!data?.books) return null;

  return (
    <>
      {data.books.map((book, index: number) => (
        <div key={index}>
          <h3>{book?.author}</h3>
          <p>{book?.title}</p>
        </div>
      ))}
    </>
  );
}

export default DisplayBooks;
