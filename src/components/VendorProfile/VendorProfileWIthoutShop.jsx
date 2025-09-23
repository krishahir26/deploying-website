import "./VendorProfileWithoutShop.css"
import {sha256sum, supabaseClient} from "../../utils.js";
import {useState} from "react";

const VendorProfileWithoutShop = ({vendorId}) => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const submitShopData = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = new FormData(e.target);
        const shopName = form.get("shop-name");
        const shopDescription = form.get("shop-description");

        const shopIcon = form.get("shop-icon");
        const shopBanner = form.get("shop-banner");
        const extraImages = form.getAll("extra-images");

        const generatedShopId = sha256sum(`${vendorId}:shop`);

        const insertIntoShops = await supabaseClient.from("shops").insert({
            shop_id: generatedShopId,
            name: shopName,
            description: shopDescription,
            menu_id: null
        });
        if (insertIntoShops.error) {
            console.error(insertIntoShops.error);
            e.target.reset();
        } else setLoadingText("adding shop to the system");

        const updateShopId = await supabaseClient.from("vendors")
            .update({shop_id: `${generatedShopId}`})
            .eq("vendor_id", `${vendorId}`);
        console.log(updateShopId);
        if (updateShopId.error) {
            console.error(updateShopId.error);
            e.target.reset();
        } else setLoadingText("adding shop to the system");

        const uploadShopIcon = await supabaseClient.storage.from("icons").upload(generatedShopId, shopIcon, {upsert: true});
        if (uploadShopIcon.error) {
            console.error(uploadShopIcon.error);
            e.target.reset();
        } else setLoadingText("uploading shop icon");

        const uploadShopBanner = await supabaseClient.storage.from("banners").upload(generatedShopId, shopBanner, {upsert: true});
        if (uploadShopBanner.error) {
            console.error(uploadShopBanner.error);
            e.target.reset();
        } else setLoadingText("uploading shop banner");

        for (const extraImage of extraImages) {
            const buffer = await extraImage.arrayBuffer();
            const imageId = sha256sum(buffer);
            const uploadExtraImage = await supabaseClient.storage.from("extra-images").upload(`${generatedShopId}-${imageId}`, extraImage, {upsert: true});
            if (uploadExtraImage.error) {
                console.error(uploadExtraImage.error);
            } else setLoadingText("uploading extra images");
        }
        location.reload();
    }
    // todo: make this look good
    return (
        <div className="vendor-profile-without-shop">
            <form className="shop-setup" onSubmit={submitShopData}>
                <fieldset disabled={loading}>
                    <label htmlFor="shop-name">
                        shop name:
                        <input
                            id="shop-name"
                            name="shop-name"
                            type="text"
                            required
                        />
                    </label><br/>
                    <label htmlFor="shop-description">
                        shop description:
                        <input
                            id="shop-description"
                            name="shop-description"
                            type="text"
                            required
                        />
                    </label><br/>
                    <label>
                        shop icon:
                        <input
                            id="shop-icon"
                            name="shop-icon"
                            type="file"
                            required
                            accept="image/png, image/jpeg"
                        />
                    </label><br/>
                    <label>
                        shop banner:
                        <input
                            id="shop-banner"
                            name="shop-banner"
                            type="file"
                            required
                            accept="image/png, image/jpeg"
                        />
                    </label><br/>
                    <label>
                        {/*min 3, max 5, max size 1mb*/}
                        extra images:
                        <input
                            id="extra-images"
                            name="extra-images"
                            type="file"
                            accept="image/png, image/jpeg"
                            multiple
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                if (files.length < 3 || files.length > 5) {
                                    alert("please add at least 3 images and at max 5");
                                    e.target.value = "";
                                    return;
                                }
                                for (const file of files) {
                                    if (file.size > 2 ** 20) { // 1MB
                                        alert("file size should be below 1mb");
                                        e.target.value = "";
                                        return;
                                    }
                                }
                            }}
                        />
                    </label><br/>
                    <button type="submit">submit</button>
                </fieldset>
            </form>
            {
                loading && (<div>{loadingText}</div>)
            }
        </div>
    )
}

export default VendorProfileWithoutShop;