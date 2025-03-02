import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";

const BudgetReview = ({ appointment, updateAppointment, btn_name }) => {
  const [openBudgetModal, setOpenBudgetModal] = useState(false);
  const [budgetAllocations, setBudgetAllocations] = useState([]);

  // Fetch budget details when modal opens
  useEffect(() => {
    if (openBudgetModal && appointment?._id) {
      axios
        .get(`http://localhost:5000/api/budget/${appointment._id}/view`)
        .then((response) => {
          setBudgetAllocations(response.data.amountAllocations || []);
        })
        .catch((error) => {
          console.error("Error fetching budget:", error);
        });
    }
  }, [openBudgetModal, appointment?._id]);

  // Open Modal
  const handleOpenBudget = () => {
    if (!appointment?._id) {
      console.log("No appointment found");
      return;
    }

    axios
      .get(`http://localhost:5000/api/budget/${appointment._id}/view`)
      .then((response) => {
        setBudgetAllocations(response.data.amountAllocations || []);
        setOpenBudgetModal(true);
      })
      .catch((error) => {
        console.error("Error fetching budget:", error);
      });
  };

  // Close Modal
  const handleCloseModals = () => {
    setOpenBudgetModal(false);
  };

  // Handle amount change
  const handleBudgetChange = (index, value) => {
    const updatedAllocations = [...budgetAllocations];
    updatedAllocations[index].amount = Number(value).toFixed(2); // Format to 2 decimal places
    setBudgetAllocations(updatedAllocations);
  };

  // Submit budget updates
  const handleBudgetSubmit = async () => {
    if (!appointment) return;

    try {
      // Send the entire budget allocation array in one request
      await axios.put(
        `http://localhost:5000/api/budget/${appointment._id}/update`,
        {
          amountAllocations: budgetAllocations.map((item) => ({
            step: item.step,
            amount: Number(item.amount).toFixed(2), // Ensure proper currency format
          })),
        }
      );

      setOpenBudgetModal(false);

      // Fetch updated appointment details
      const response = await axios.get(
        `http://localhost:5000/api/appointments/${appointment._id}/view`
      );

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
      <Button variant="contained" color="primary" onClick={handleOpenBudget}>
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
              <Typography variant="body1" sx={{ width: "60%" }}>
                {item.des} {/* Display description (non-editable) */}
              </Typography>
              <TextField
                label="Amount (USD)"
                variant="outlined"
                size="small"
                type="text" // Change from "number" to "text"
                value={item.amount}
                onChange={(e) => handleBudgetChange(index, e.target.value)}
                inputProps={{
                  inputMode: "decimal", // Ensures numeric keyboard on mobile
                  pattern: "[0-9]+(.[0-9]{1,2})?", // Allows only numbers with up to 2 decimal places
                }}
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
              onClick={handleBudgetSubmit}
              sx={{ width: "48%" }}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseModals}
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
