import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";

import { graphql } from "../__generated__/gql";

export const GET_HELLO = graphql(`
  query Hello {
    hello
  }
`);

function DisplayHello() {
  const { data, loading, error } = useQuery(GET_HELLO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return <Typography>{data?.hello}</Typography>;
}

export default DisplayHello;
