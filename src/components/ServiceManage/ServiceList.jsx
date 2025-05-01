import React from "react";
import ServiceItem from "./ServiceItem";
import { List } from "@mui/material";

const ServiceList = ({ services, onToggle, onDelete, onUpdate }) => {
  return (
    <List sx={{ mt: 2 }}>
      {services.map((service) => (
        <ServiceItem
          key={service._id}
          service={service}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </List>
  );
};

export default ServiceList;
