import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ButtonLink = ({ to, children }) => (
  <Link to={to} style={{ textDecoration: "none", width: "100%" }}>
    <Button variant="outlined" color="primary" fullWidth size="small">
      {children}
    </Button>
  </Link>
);

export default ButtonLink;
