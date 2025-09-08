import "./AdminProfile.css"
import {getAllVendors, supabaseClient, useSession} from "../../utils.js";
import {useEffect, useState} from "react";

const AdminProfile = () => {
    const session = useSession();
    const [vendors, setVendors] = useState(null);
    const [email, setEmail] = useState("");
    useEffect(() => {
        if (!session) return;
        getAllVendors().then(v => setVendors(v)).catch(console.error);
    }, [session]);
    let res;
    if (vendors === null) res = (
        <div>there are no vendors on ts<br/></div>); else res = JSON.stringify(vendors, null, 2);
    const insertVendor = async (e) => {
        e.preventDefault();
        if (email === "") return;
        const {error,} = await supabaseClient
            .from("vendors")
            .insert({vendor_id: btoa(email), email: email, shop_id: null});
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
    return (
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

