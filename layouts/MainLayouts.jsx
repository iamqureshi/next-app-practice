import { Box, Container } from "@mui/material";
import TopAppBar from "./TopAppBar";
import Footer from "./Footer";
import React from "react";

export default function MainLayouts(props) {
  return (
    <React.Fragment>
      <TopAppBar />
      <Box
        py={4}
        sx={{
          minHeight: "85vh",
        }}
      >
        <Container>
          <Container maxWidth="lg">{props.children}</Container>
        </Container>
      </Box>
      <Footer />
    </React.Fragment>
  );
}
