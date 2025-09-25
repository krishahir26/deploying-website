import "./AdminLogin.css";
import { supabaseClient, useSession, ifNotAdminRedirect } from "../../utils.js";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import loginLogo from "../../assets/logo.png"; // ✅ same logo import

const AdminLogin = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) return;
    ifNotAdminRedirect(session, navigate).catch(console.error);
  }, [navigate, session]);

  if (session === undefined) return <p>Loading...</p>;

  if (session === null)
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
          <p className="tagline">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Admin</h2>
            <p>Sign in with your admin account</p>
          </div>

          <div className="supabase-auth-admin">
            <Auth
              supabaseClient={supabaseClient}
              appearance={{ theme: ThemeSupa }}
              providers={["google"]}
              onlyThirdPartyProviders={true}
              redirectTo={window.location.origin + "/admin-profile"}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2025 Hungry Hub. Admin Portal.</p>
        </div>
      </div>
    );

  return <div>checking access...</div>;
};

export default AdminLogin;
