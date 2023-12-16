import * as React from "react";
import { Link as LinkRouter } from "react-router-dom";
import {
  Button,
  Box,
} from "@mui/material";
import Image from "components/Image";

type Props = {
  role?: string;
};

const NavBar = (props: Props) => {

  const pages = [
    "Schedules", 
    "Booking", 
    "Tickets", 
    "Surveys"
  ];

  const options = 
    [
      props.role === "administrator" && "Users",
      "Profile",
      "Logout",
    ].filter(Boolean)
  ;

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Box>
        <Box sx={{ flexGrow: 1, ml: 3, display: "flex" }}>
          {pages.map((page) => (
            <Button
              key={page}
              component={LinkRouter}
              to={page}
              color="inherit"
            >
              {page}
            </Button>
          ))}
        </Box>
        <Box sx={{ flexGrow: 1, ml: 3, display: "flex" }}>
          {options.map((page) => !!page && (
            <Button
              key={page}
              component={LinkRouter}
              to={page}
              color="inherit"
            >
              {page}
            </Button>
          ))}
        </Box>
      </Box>
      <Box sx = {{marginRight: "1rem"}}><a href="/"><Image path="logo_colors" hasSet alt="Amonic Airlines Logo"/></a></Box>
    </Box>
  );
};
export default NavBar;
