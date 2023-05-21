import { gql, useQuery } from "@apollo/client";

const GET_BOOKS = gql`
  query GetBooks {
    books {
      title
      author
    }
  }
`;

function DisplayBooks() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return data.books.map(
    ({ title, author }: { title: string; author: string }, index: number) => (
      <div key={index}>
        <h3>{title}</h3>
        <p>{author}</p>
      </div>
    )
  );
}

function App() {
  return (
    <div>
      <header>
        <p>Welcome</p>
      </header>
      <DisplayBooks />
    </div>
  );
}

export default App;
