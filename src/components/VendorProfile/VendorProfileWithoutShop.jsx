import { sha256sum, supabaseClient } from "../../utils.js";
import { useState } from "react";
import "./VendorProfileWithoutShop.css"; // remove the second one


const VendorProfileWithoutShop = ({ vendorId }) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  // Previews
  const [iconPreview, setIconPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [extraPreviews, setExtraPreviews] = useState([]);

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

    // Insert shop info
    const insertIntoShops = await supabaseClient.from("shops").insert({
      shop_id: generatedShopId,
      name: shopName,
      description: shopDescription,
      menu_id: null,
    });

    if (insertIntoShops.error) {
      console.error(insertIntoShops.error);
      e.target.reset();
      setLoading(false);
      return;
    } else setLoadingText("Adding shop to the system...");

    // Update vendor with shop id
    const updateShopId = await supabaseClient
      .from("vendors")
      .update({ shop_id: `${generatedShopId}` })
      .eq("vendor_id", `${vendorId}`);

    if (updateShopId.error) {
      console.error(updateShopId.error);
      e.target.reset();
      setLoading(false);
      return;
    } else setLoadingText("Linking shop with vendor...");

    // Upload Shop Icon
    if (shopIcon && shopIcon.size > 0) {
      const uploadShopIcon = await supabaseClient.storage
        .from("icons")
        .upload(generatedShopId, shopIcon, { upsert: true });
      if (uploadShopIcon.error) console.error(uploadShopIcon.error);
      else setLoadingText("Uploading shop icon...");
    }

    // Upload Shop Banner
    if (shopBanner && shopBanner.size > 0) {
      const uploadShopBanner = await supabaseClient.storage
        .from("banners")
        .upload(generatedShopId, shopBanner, { upsert: true });
      if (uploadShopBanner.error) console.error(uploadShopBanner.error);
      else setLoadingText("Uploading shop banner...");
    }

    // Upload Extra Images
    for (const extraImage of extraImages) {
      const buffer = await extraImage.arrayBuffer();
      const imageId = sha256sum(buffer);
      const uploadExtraImage = await supabaseClient.storage
        .from("extra-images")
        .upload(`${generatedShopId}-${imageId}`, extraImage, { upsert: true });

      if (uploadExtraImage.error) {
        console.error(uploadExtraImage.error);
      } else setLoadingText("Uploading extra images...");
    }

    setLoading(false);
    location.reload();
  };

  const handleExtraImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length < 3 || files.length > 5) {
      alert("Please add at least 3 and at most 5 images.");
      e.target.value = "";
      return;
    }

    for (const file of files) {
      if (file.size > 1048576) {
        alert("File size should be below 1MB");
        e.target.value = "";
        return;
      }
    }

    setExtraPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  return (
    <>
      {/* Background Overlay */}
      <div className="background-overlay"></div>

      <div className="vendor-profile-without-shop">
        {/* Page Title */}
        <h1 className="page-title">Vendor Shop Setup</h1>

        {/* Form */}
        <form className="shop-setup" onSubmit={submitShopData}>
          <fieldset disabled={loading}>
            <label htmlFor="shop-name">
              Shop name:
              <input id="shop-name" name="shop-name" type="text" required />
            </label>
            <br />

            <label htmlFor="shop-description">
              Shop description:
              <input
                id="shop-description"
                name="shop-description"
                type="text"
                required
              />
            </label>
            <br />

            {/* Icon Upload */}
            <label>
              Shop Icon:
              <input
                id="shop-icon"
                name="shop-icon"
                type="file"
                required
                accept="image/png, image/jpeg"
                onChange={(e) =>
                  e.target.files[0] &&
                  setIconPreview(URL.createObjectURL(e.target.files[0]))
                }
              />
            </label>
            {iconPreview && (
              <img
                src={iconPreview}
                alt="icon preview"
                className="preview small"
              />
            )}
            <br />

            {/* Banner Upload */}
            <label>
              Shop Banner:
              <input
                id="shop-banner"
                name="shop-banner"
                type="file"
                required
                accept="image/png, image/jpeg"
                onChange={(e) =>
                  e.target.files[0] &&
                  setBannerPreview(URL.createObjectURL(e.target.files[0]))
                }
              />
            </label>
            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="banner preview"
                className="preview banner"
              />
            )}
            <br />

            {/* Extra Images */}
            <label>
              Extra images (min 3, max 5, 1MB each):
              <input
                id="extra-images"
                name="extra-images"
                type="file"
                accept="image/png, image/jpeg"
                multiple
                onChange={handleExtraImages}
              />
            </label>
            <div className="extra-preview-grid">
              {extraPreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`extra ${idx}`}
                  className="preview small"
                />
              ))}
            </div>

            <br />
            <button type="submit">Submit</button>
          </fieldset>
        </form>

        {loading && <div className="loading-text">{loadingText}</div>}
      </div>
    </>
  );
};

export default VendorProfileWithoutShop;
