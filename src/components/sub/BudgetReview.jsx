import React, { useState } from "react";
import axios from "axios";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";

const baseURL=import.meta.env.VITE_API_BASE_URL;

const BudgetReview = ({ appointment, updateAppointment, btn_name,showSnackbar }) => {
  const [openBudgetModal, setOpenBudgetModal] = useState(false);
  const [budgetAllocations, setBudgetAllocations] = useState([]);

  // Open Modal
  const handleOpenBudget = async () => {
    if (!appointment?._id) {
      console.log("No appointment found");
      return;
    }

    try {
      const response = await axios.get(
        `${baseURL}/budget/${appointment._id}/view`
      );
      setBudgetAllocations(response.data.amountAllocations);
      setOpenBudgetModal(true);
    } catch (error) {
      console.error("Error fetching budget:", error);
    }
  };

  // Close Modal
  const handleCloseModals = () => {
    setOpenBudgetModal(false);
  };

  // Handle amount change
  const handleBudgetChange = (index, value) => {
    const updatedAllocations = [...budgetAllocations];

    // Ensure the value is a valid number and is positive
    const parsedValue = parseFloat(value);

    // Only update if the value is valid and positive
    updatedAllocations[index].amount =
      !isNaN(parsedValue) && parsedValue > 0 ? parsedValue : 0;

    // Update state correctly to trigger re-render
    setBudgetAllocations(updatedAllocations);
  };

  // Submit budget updates
  const handleBudgetSubmit = async () => {
    if (!appointment) return;
    setOpenBudgetModal(false);
    try {
      // Send the entire budget allocation array in one request
      for (const allocation of budgetAllocations) {
        await axios.put(
          `${baseURL}/budget/${appointment._id}/update`,
          { step: allocation.step, amount: allocation.amount }
        );
      }

      // Fetch updated appointment details
      // const response = await axios.get(
      //   `http://localhost:5000/api/appointments/${appointment._id}/view`
      // );

      // Update the parent component with the latest appointment data
      updateAppointment(response.data);
     
      // Update local state with the latest budget
      setBudgetAllocations(response.data.amountAllocations);
    
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  return (
    <>
      <Button variant="contained" sx={{backgroundColor:"#33383E"}} onClick={handleOpenBudget}>
        {btn_name}
      </Button>

      <Modal open={openBudgetModal} onClose={handleCloseModals}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Budget Review for {appointment?.vehicleNumber}
          </Typography>

          {budgetAllocations.map((item, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
            >
              <Typography variant="body1">{item.step}</Typography>
              <Typography variant="body1" sx={{ width: "60%" }}>
                {item.des}
              </Typography>
              <TextField
                label="Amount (LKR)"
                variant="outlined"
                size="small"
                type="number"
                value={item.amount}
                onChange={(e) => handleBudgetChange(index, e.target.value)}
                sx={{ width: "40%" }}
              />
            </Box>
          ))}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={()=>{
                handleBudgetSubmit();
                showSnackbar("Budget Reviewed","success");
              }}
              sx={{ width: "48%" }}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={()=>{
                handleCloseModals();
                showSnackbar("Nothing Changed","warning");
              }}
              sx={{ width: "48%" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default BudgetReview;
