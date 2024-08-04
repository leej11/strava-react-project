import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// contexts
import { AuthContext } from "../context/AuthContext";

function AuthHandler() {
  const navigate = useNavigate();
  const location = useLocation(); // Accesses the URL
  const { dispatch: authDispatch, authDetails } = useContext(AuthContext);

  useEffect(() => {
    // This function runs after component mounts and whenever the `location` changes
    console.log("Location is: ", location);
    const query = new URLSearchParams(location.search); // Parses the query string
    const code = query.get("code"); // Retrieves the authorization code from URL parameter `code`
    console.log("Code is: ", code);
    if (code) {
      // If code is present, send it to the backend
      fetch(
        `http://localhost:${process.env.REACT_APP_FRONTEND_PORT}/api/activities/exchange_token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }), // Sends code to your server
        }
      )
        .then((response) => response.json()) // Parses the JSON returned by the server
        .then((data) => {
          console.log("Access Token:", data.access_token); // Log or handle the access token
          console.log("Access Token:", data);
          // Store auth tokens in authContext
          authDispatch({ type: "SET_AUTH", payload: data });
          console.log("Successful dispatch of auth data:", data);
          // You might want to store it or redirect the user to another part of your application
          navigate("/"); // Navigate to the homepage
        })
        .catch((error) => {
          console.error("Error fetching access token:", error);
        });
    }
  }, [location.search]); // Effect dependency array includes `location` to react to changes in the URL

  return (
    <div>
      <h1>Authorization successful, retrieving your access token...</h1>
    </div>
  );
}

export default AuthHandler;
