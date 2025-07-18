import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setMessage(data.message || "Email verified successfully!");
        } else {
          setMessage(data.message || "Verification failed.");
        }
      } catch (error) {
        setMessage("Something went wrong.");
        console.error(error);
      }
    };

    if (token) {
      verify();
    } else {
      setMessage("No token provided.");
    }
  }, [token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
}

export default VerifyEmail;
