import { Box, Paper, Tab, Tabs } from "@mui/material";  // removed Typography from here
import React from "react";
import Signup from "../pages/SignupPage";
import VehicleForm from "../pages/VehicleForm";

const paperStyle = { width: 460, margin: "20px auto", padding: 10 }; // added padding:20px
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ mt: 1 }}>  {/* add margin top for little breathing space */}
          {children}
        </Box>
      )}
    </div>
  );
}

const SignInVehicleContainer = () => {
  const [value, setValue] = React.useState(0);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper elevation={20} style={paperStyle}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        variant="fullWidth" // ADD this: makes tabs take full width
        aria-label="disabled tabs example"
      >
        <Tab label="Sign Up" />
        <Tab label="Vehicle Details" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Signup /> 
      </TabPanel>
      <TabPanel value={value} index={1}>
        <VehicleForm />
      </TabPanel>
    </Paper>
  );
};

export default SignInVehicleContainer;
