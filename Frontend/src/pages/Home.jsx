import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
    return (
        <div>
            <Navbar />
            <div className="container mx-auto text-center py-10">
                <h1 className="text-3xl font-bold">Welcome to Home Page</h1>
                <p className="text-lg text-gray-700 mt-4">This is the homepage of our application.</p>
            </div>
        </div>
    );
};

export default Home;
