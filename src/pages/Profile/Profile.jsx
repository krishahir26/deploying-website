import React, { useEffect, useState } from "react";
import { supabaseClient, useSession } from "../../utils.js";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    if (session === null) {
      navigate("/login", { replace: true });
    }
    if (session) {
      const { user } = session;
      setProfileData({
        name: user.user_metadata?.full_name || "User Name",
        email: user.email,
        avatar:
          user.user_metadata?.avatar_url ||
          `https://ui-avatars.com/api/?name=${user.email}`,
      });
    }
  }, [session, navigate]);

  if (session === undefined) return <p>Loading...</p>;

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className={styles["profile-container"]}>
      <div className={styles["profile-card"]}>
        <div className={styles["profile-avatar"]}>
          <img src={profileData.avatar} alt="Profile" />
        </div>
        <div className={styles["profile-info"]}>
          <h2>{profileData.name}</h2>
          <p>{profileData.email}</p>
        </div>
        <button className={styles["logout-btn"]} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
