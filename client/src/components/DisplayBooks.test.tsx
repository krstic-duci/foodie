import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import DisplayBooks, { GET_BOOKS } from "./DisplayBooks";

it("should render", async () => {
  const mocks = [
    {
      request: {
        query: GET_BOOKS
      },
      result: {
        data: {
          getBooks: [
            { title: "Buck", author: "bulldog" },
            { title: "Harry Potter", author: "J.K.Rowling" }
          ]
        }
      }
    }
  ];
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <DisplayBooks />
    </MockedProvider>
  );
  expect(await screen.findByText("Loading...")).toBeInTheDocument();
  // expect(await screen.findByText("Buck")).toBeInTheDocument();
  // expect(await screen.findByText("Harry Potter")).toBeInTheDocument();
});

it("should show error UI", async () => {
  const mocks = {
    request: {
      query: GET_BOOKS
    },
    error: new Error("An error occurred")
  };
  render(
    <MockedProvider mocks={[mocks]} addTypename={false}>
      <DisplayBooks />
    </MockedProvider>
  );
  expect(await screen.findByText("An error occurred")).toBeInTheDocument();
});
