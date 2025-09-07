import "./Restaurants.css"
import {useEffect, useState} from "react";
import {supabaseClient} from "../../utils.js";

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    useEffect(() => {
        supabaseClient
            .from("shops")
            .select("id, name, description")
            .then((res) => {
                if (res.error) {
                    // tell user there was an error while processing this request
                } else {
                    setRestaurants(res.data);
                }
            })
    })
    if (restaurants.length === 0) {
        return (
            <div className="restaurants">
                No restaurants found!
            </div>
        )
    } else {
        return (
            <div className="restaurants">
                <pre>{JSON.stringify(restaurants, null, 2)}</pre>
            </div>
        )
    }

    // else return <div>lol</div>
}

export default Restaurants