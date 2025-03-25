import React from 'react'
import ReceiptIcon from "@mui/icons-material/Receipt";

function InvoiceView({appointment}) {
  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState(null);

  const fetchBudget = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/budget/${appointment._id}/view`
      );
      setBudget(response.data || {});
      setOpen(true);
    } catch (error) {
      console.error("Error fetching budget:", error);
      setBudget({ amountAllocations: [] }); // Fallback to prevent crashes
    }
  };
  return (
   <ReceiptIcon
                      fontSize="large"
                      onClick={() => alert("Are you sure you want to delete this?")}
                      style={{ cursor: "pointer" }}
                    />

  )
}

export default InvoiceView;