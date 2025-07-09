// src/components/Feedback/ButtonLink.jsx

import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ButtonLink = ({ to, children }) => (
  <Link to={to} style={{ textDecoration: "none", width: "100%" }}>
    <Button
      variant="outlined"
      color="secondary"
      fullWidth
      size="small"
      sx={{
        borderRadius: "8px",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "#f0f0f0",
        },
      }}
    >
      {children}
    </Button>
  </Link>
);

export default ButtonLink;
