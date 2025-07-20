// SupervisorTechnicianProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserProfile from "./UserProfile"; // reuse existing UI

const SupervisorTechnicianProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(res.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!userData) return <div>Failed to load profile.</div>;

  return <UserProfile externalUser={userData} />;
};

export default SupervisorTechnicianProfile;
