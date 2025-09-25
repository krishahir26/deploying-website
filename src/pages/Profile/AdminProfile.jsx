import "./AdminProfile.css"
import { getAllVendors, ifNotAdminRedirect, sha256sum, supabaseClient, useSession } from "../../utils.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const insertVendor = async (e) => {
        e.preventDefault();
        const { error } = await supabaseClient
            .from("vendors")
            .insert({ vendor_id: sha256sum(email), email: email, shop_id: null });
        if (error) {
            console.error(error);
            alert("Error adding vendor: " + JSON.stringify(error));
            return;
        }
        location.reload();
    }

    const deleteVendor = async (vendorId) => {
        if (!window.confirm("Are you sure you want to delete this vendor?")) return;
        const { error } = await supabaseClient
            .from("vendors")
            .delete()
            .eq("vendor_id", vendorId);
        if (error) {
            console.error(error);
            alert("Error deleting vendor: " + JSON.stringify(error));
            return;
        }
        setVendors(vendors.filter(v => v.vendor_id !== vendorId));
    }

    return (
        <div className="admin-profile-page">
            <div className="background-overlay"></div> {/* background overlay */}

            <div className="admin-profile-container">
                <h2>Admin Vendor Management</h2>

                {/* Vendor Table */}
                {vendors && vendors.length > 0 ? (
                    <table className="vendor-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Vendor ID</th>
                                <th>Shop ID</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map((v) => (
                                <tr key={v.vendor_id}>
                                    <td>{v.email}</td>
                                    <td>{v.vendor_id}</td>
                                    <td>{v.shop_id || "-"}</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => deleteVendor(v.vendor_id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No vendors found.</p>
                )}

                {/* Vendor Form */}
                <form className="vendor-form" onSubmit={insertVendor}>
                    <label htmlFor="vendor-email">Vendor Email:</label><br/>
                    <input
                        type="email"
                        name="email"
                        className="email"
                        required
                        onChange={e => setEmail(e.target.value)}
                    /><br/>
                    <button type="submit">Add Vendor</button>
                </form>
            </div>
        </div>
    )
}

export default AdminProfile;
