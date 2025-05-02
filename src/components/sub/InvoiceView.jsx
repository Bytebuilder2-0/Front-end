import React, { useState } from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";


const baseURL=import.meta.env.VITE_API_BASE_URL;

function InvoiceView({appointment}) {
  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState(null);

  const fetchBudget = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/budget/${appointment._id}/view`
      );
      setBudget(response.data || {});
      setOpen(true);
    } catch (error) {
      console.error("Error fetching budget:", error);
      setBudget({ amountAllocations: [] }); // Fallback to prevent crashes
    }
  };
  return (
    <>
 <ReceiptIcon
        fontSize="large"
        style={{ cursor: "pointer" }}
        onClick={fetchBudget}
      />


                    <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    fullWidth
                    maxWidth="sm"
                  >
                    <DialogTitle>Budget Details</DialogTitle>
                    <DialogContent>
                      {budget ? (
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Step</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Amount</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(budget.amountAllocations || []).map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>{item.step}</TableCell>
                                  <TableCell>{item.des}</TableCell>
                                  <TableCell>${item.amount}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </DialogContent>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                  </Dialog>
    </>
  
            

  )
}

export default InvoiceView;