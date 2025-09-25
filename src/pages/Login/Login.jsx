import React from "react";
import "./Login.css";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabaseClient } from "../../utils.js";
import { Auth } from "@supabase/auth-ui-react";
import loginLogo from "../../assets/logo.png"; // ✅ Add your logo

const Login = () => {
  // ✅ Custom theme (yellow + orange, same as AdminLogin)
  const authAppearance = {
    theme: ThemeSupa,
    variables: {
      default: {
        colors: {
          brand: "#FFC107", // yellow
          brandAccent: "#FF9800", // orange
        },
      },
    },
  };

  return (
    <div className="login-container">
      {/* Background Overlay */}
      <div className="background-overlay"></div>

      {/* Logo + Title */}
      <div className="logo-section">
        <div className="logo">
          <img src={loginLogo} alt="App Logo" />
        </div>
        <h1 className="brand-name">Hungry Hub</h1>
        <p className="tagline">Vendor / User Access</p>
      </div>

      {/* Login Card */}
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome</h2>
          <p>Sign in with your account</p>
        </div>

        {/* Supabase Auth (Google Sign-In) */}
        <div className="google-signin-container">
          <Auth
            supabaseClient={supabaseClient}
            appearance={authAppearance}
            providers={["google"]}
            onlyThirdPartyProviders={true}
            redirectTo={window.location.origin + "/"}
          />
        </div>

        {/* Quick Access */}
        <div className="quick-access">
          <p>
            Are you a vendor?{" "}
            <a href="/vendor-login" className="signup-link">
              Click Here!
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="login-footer">
        <p>&copy; 2025 Hungry Hub. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
