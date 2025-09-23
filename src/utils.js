import {createClient} from "@supabase/supabase-js";
import {useEffect, useState} from "react";
import {sha256} from "js-sha256";
import {redirect} from "react-router-dom";


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

export const ifNotVendorRedirect = async (session, navigate) => {
    if (session === null) redirect("/404", 404);
    const emailSHA256 = sha256sum(session.user.email);
    const {error, data} = await supabaseClient
        .from("vendors")
        .select("vendor_id")
        .eq("vendor_id", emailSHA256)
        .limit(1);
    if (error) {
        console.error(error);
        return;
    }
    if (!data || data.length === 0) {
        await supabaseClient.auth.signOut();
        navigate("/unauthorized");
    }
    const {vendor_id} = data[0];
    if (vendor_id === null) {
        await supabaseClient.auth.signOut();
        navigate("/unauthorized");
    }
}

export const ifNotAdminRedirect = async (session, navigate) => {
    if (session === null) redirect("/404", 404);
    const {error, data} = await supabaseClient
        .from("admins")
        .select("email")
        .eq("email", session.user.email)
        .limit(1);
    if (error) {
        console.error(error);
        return;
    }
    if (!data || data.length === 0) {
        await supabaseClient.auth.signOut();
        navigate("/unauthorized");
    }
    const {email} = data[0];
    if (email === null) {
        await supabaseClient.auth.signOut();
        navigate("/unauthorized")
    }
}

export const vendorHasShop = async (session) => {
    const emailSHA256 = sha256sum(session.user.email);
    const {data, error} = await supabaseClient
        .from("vendors")
        .select("shop_id, vendor_id")
        .eq("vendor_id", emailSHA256)
        .limit(1);
    if (error) {
        console.error(error);
        return {shop_id: null};
    }
    if (!data || data.length === 0) return {shop_id: null};
    const {shop_id, vendor_id} = data[0];
    return {vendor_id, shop_id};
}

export const getShop = async (shopId) => {
    const {data, error} = await supabaseClient
        .from("shops")
        .select("*")
        .eq("shop_id", shopId)
        .limit(1);
    if (error) {
        console.error(error);
        return null;
    }
    if (!data || data.length === 0) return null;
    return data[0];
}

export const getAllShops = async () => {
    const {data, error} = await supabaseClient
        .from("shops")
        .select("*");
    if (error) {
        console.error(error);
        return [];
    }
    return data;
}

export const getShopImages = async (shopId) => {
    const icon = supabaseClient.storage.from("icons").getPublicUrl(shopId);
    const banner = supabaseClient.storage.from("banners").getPublicUrl(shopId);
    const extraImages = await supabaseClient.storage.from("extra-images").list("", {search: shopId});
    if (extraImages.error) {
        console.error(extraImages.error);
        return null;
    }
    const extraImageUrls = [];
    for (const extra of extraImages.data) {
        const {data} = supabaseClient.storage.from("extra-images").getPublicUrl(extra.name);
        extraImageUrls.push(data.publicUrl);
    }
    return {
        iconUrl: icon.data.publicUrl,
        bannerUrl: banner.data.publicUrl,
        extraImages: extraImageUrls
    };
}

export const getAllShopImages = async () => {
    const shops = await getAllShops();
    if (shops.length === 0) return [];
    let res = [];
    for (const shop of shops) {
        const images = await getShopImages(shop.shop_id);
        res.push({shop_id: shop.shop_id, images: images});
    }
    return res;
}

export const getShopInfo = async (shopId) => {
    const shopData = await getShop(shopId) ;
    if (shopData === null) return null;
    const shopImages = await getShopImages(shopId) ;
    return {...shopData , ...shopImages };
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

export const getMenuItems = async (menuId) => {
    const {data, error} = await supabaseClient
        .from("menu")
        .select("*")
        .eq("menu_id", menuId);
    if (error) {
        console.error(error);
        return [];
    }
    if (!data || data.length === 0) return [];
    return data;
}

export const sha256sum = (input) => {
    return sha256(input);
}