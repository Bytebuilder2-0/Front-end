import React from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { IconButton } from "@mui/material";

const WhatsAppButton = ({ phone, VNumber }) => {
  const handleClick = () => {
    if (!phone) {
      alert("Phone number not available!");
      return;
    }
    const message = `Hello "${VNumber}" vehicle owner,\nWe are from Garage 24`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    
  };

  return (
    <IconButton onClick={handleClick} color="success" sx={{ fontSize: 40 }}>
      <WhatsAppIcon fontSize="inherit" />
    </IconButton>
  );
};

export default WhatsAppButton;
