import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";

export default function Footer() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            textAlign={"center"}
            component="div"
            sx={{ flexGrow: 1 }}
          >
            samirqureshi@gmail.com @2024 all right reserved
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
