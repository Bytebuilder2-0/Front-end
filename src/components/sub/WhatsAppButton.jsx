import React from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { IconButton } from "@mui/material";

const WhatsAppButton = ({ phone }) => {
  const handleClick = () => {
    if (!phone) {
      alert("Phone number not available!");
      return;
    }
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  return (
    <IconButton onClick={handleClick} color="success" sx={{ fontSize: 40 }}>
      <WhatsAppIcon fontSize="inherit" />
    </IconButton>
  );
};

export default WhatsAppButton;
