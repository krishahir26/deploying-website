import "./AdminProfile.css"
import {getAllVendors, ifNotAdminRedirect, sha256sum, supabaseClient, useSession} from "../../utils.js";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const AdminProfile = () => {
    const session = useSession();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState(undefined);
    const [email, setEmail] = useState("");
    useEffect(() => {
        if (!session) return;
        ifNotAdminRedirect(session, navigate).catch(console.error);
    }, [navigate, session]);
    useEffect(() => {
        getAllVendors().then(v => setVendors(v)).catch(console.error);
    }, []);
    if (!session) return (<p>Loading...</p>);
    let res;
    if (vendors === null) res = (
        <div>there are no vendors on ts<br/></div>); else res = (
        <pre><code>{JSON.stringify(vendors, null, 2)}</code></pre>);
    const insertVendor = async (e) => {
        e.preventDefault();
        const {error,} = await supabaseClient
            .from("vendors")
            .insert({vendor_id: sha256sum(email), email: email, shop_id: null});
        if (error) {
            console.error(error);
            res = (
                <div>
                    error: {JSON.stringify(error)}
                </div>
            );
        }
        location.reload();
    }
    // necessary to check if the session is valid
    if (session) return (
        <div className="admin-profile">
            {res}
            <form className="vendor-form" onSubmit={insertVendor}>
                <label htmlFor="vendor-email">vendor email:</label><br/>
                <input
                    type="email"
                    name="email"
                    className="email"
                    required
                    onChange={e => setEmail(e.target.value)} // automatically update the `email` var to whatever the user types in
                /> <br/>
                <button type="submit">submit</button>
            </form>

        </div>
    )
}

export default AdminProfile;

