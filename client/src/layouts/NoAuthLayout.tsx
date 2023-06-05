import { Container } from "@mui/material";
import { FC, ReactNode } from "react";

type NoAuthLayoutProps = {
  children: ReactNode;
  centered?: boolean;
};

const NoAuthLayout: FC<NoAuthLayoutProps> = ({
  children,
  centered = false
}) => {
  return (
    <>
      <Container
        maxWidth='lg'
        sx={{
          ...(centered && {
            display: "flex",
            height: "100vh",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center"
          })
        }}
      >
        {children}
      </Container>
    </>
  );
};

export default NoAuthLayout;
