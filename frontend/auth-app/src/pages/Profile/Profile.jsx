import { useEffect, useState } from "react";
import { fetchProfile } from "../../service/api";
import "./Profile.css";

function Profile() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const getProfile = async () => {

      try {

        const token = localStorage.getItem("token");

        const result = await fetchProfile(token);

        setUser(result.user);

      } catch (error) {
        console.log(error);
      }
    };

    getProfile();

  }, []);

  return (
    <div className="profile-container">

      <div className="profile-card">

        <h1 className="profile-title">
          Profile Page
        </h1>

        {user ? (
          <>
            <div className="profile-box">
              <span className="profile-label">
                User ID
              </span>

              <p>{user.id}</p>
            </div>

            <div className="profile-box">
              <span className="profile-label">
                Email
              </span>

              <p>{user.email}</p>
            </div>

            <div className="profile-box">
              <span className="profile-label">
                Created At
              </span>

              <p>{user.created_at}</p>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}

      </div>

    </div>
  );
}

export default Profile;