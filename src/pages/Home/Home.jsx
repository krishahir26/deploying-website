import React from 'react'
import "./Home.css"
import Header from "../../components/Header/Header";

const Home = () => {
    // const [res, setRes] = useState([]);
    // useEffect(() => {
    //     fetch("https://api.thecatapi.com/v1/images/search?limit=10")
    //         .then(res => res.json())
    //         .then(data => setRes(data))
    //         .catch(err => console.error(err));
    // }, []);
    // const json = await data.json();
    return (
        <div>
            <Header/>
        </div>
    )
}

export default Home