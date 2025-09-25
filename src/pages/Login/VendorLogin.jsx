import React, { useEffect } from 'react'
import "./VendorLogin.css"
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { ifNotVendorRedirect, supabaseClient, useSession } from "../../utils.js";
import { Auth } from "@supabase/auth-ui-react";
import { useNavigate } from "react-router-dom";
import loginLogo from "../../assets/logo.png";   // ✅ Correct import

const VendorLogin = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) return;
    ifNotVendorRedirect(session, navigate).catch(console.error);
  }, [navigate, session]);

  if (session === undefined) return (<p>Loading...</p>);

  if (session === null) return (
    <div className="login-container">
      {/* Background Overlay */}
      <div className="background-overlay"></div>

      {/* Logo + Title */}
      <div className="logo-section">
        <div className="logo">
          <img src={loginLogo} alt="App Logo" />  {/* ✅ Works now */}
        </div>
        <h1 className="brand-name">Hungry Hub</h1>
        <p className="tagline">Vendor Portal</p>
      </div>

      {/* Login Card */}
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Vendor</h2>
          <p>Sign in with your vendor account</p>
        </div>

        <div className="supabase-auth-vendor">
          <Auth
            supabaseClient={supabaseClient}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]}
            onlyThirdPartyProviders={true}
            redirectTo={window.location.origin + "/vendor-profile"}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="login-footer">
        <p>© 2025 Hungry Hub. Vendor Portal.</p>
      </div>
    </div>
  );

  return (<div>checking access...</div>);
}

export default VendorLogin;
