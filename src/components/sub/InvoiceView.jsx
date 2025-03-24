import React from 'react'
import ReceiptIcon from "@mui/icons-material/Receipt";

function InvoiceView({appointment}) {
  return (
   <ReceiptIcon
                      fontSize="large"
                      onClick={() => alert("Are you sure you want to delete this?")}
                      style={{ cursor: "pointer" }}
                    />
  )
}

export default InvoiceView;