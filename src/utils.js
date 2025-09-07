import {createClient} from "@supabase/supabase-js";
import {useEffect, useState} from "react";

export const supabaseClient = createClient(import.meta.env.VITE_SUPABASE_PROJECT_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

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