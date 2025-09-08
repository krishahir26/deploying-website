import {createClient} from "@supabase/supabase-js";
import {useEffect, useState} from "react";

export const supabaseClient = createClient(import.meta.env.VITE_SUPABASE_PROJECT_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);


// any functions which start with `use` are react hooks
export const useSession = () => {
    const [session, setSession] = useState(undefined);
    useEffect(() => {
        supabaseClient
            .auth
            .getSession()
            .then(({data: {session}}) => setSession(session))
        const {data: {subscription}} = supabaseClient
            .auth
            .onAuthStateChange((_event, session) => setSession(session))
        return () => subscription.unsubscribe()
    }, []);
    return session;
}

export const isVendor = async (session, navigate) => {
    const {data, error} = await supabaseClient
        .from("vendors")
        .select("email")
        .eq("email", session.user.email)
        .limit(1);
    if (error) {
        console.error(error);
        return;
    }
    if (!data || data.length === 0) {
        await supabaseClient.auth.signOut();
        navigate("/unauthorized", {replace: true});
    }
}

export const isSuperAdmin = async (session, navigate) => {
    const {data, error} = await supabaseClient
        .from("super_admins")
        .select("email")
        .eq("email", session.user.email)
        .limit(1);
    if (error) {
        console.error(error);
        return;
    }
    if (!data || data.length === 0) {
        await supabaseClient.auth.signOut();
        navigate("/unauthorized", {replace: true});
    } else {
        navigate("/404", {replace: true});
    }
}

export const vendorHasShop = async (session) => {
    const {data, error} = await supabaseClient
        .from("vendors")
        .select("shop_id")
        .eq("email", session.user.email)
        .limit(1);
    if (error) {
        console.error(error);
        return false;
    }
    if (!data || data.length === 0) return false;
    const {shop_id} = data[0];
    return shop_id !== null;
}

export const getAllVendors = async () => {
    const {data, error} = await supabaseClient
        .from("vendors")
        .select("*");
    if (error) {
        console.error(error);
        return null;
    }
    if (!data || data.length === 0) return null;
    return data;
}