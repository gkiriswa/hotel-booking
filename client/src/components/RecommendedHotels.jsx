import React, { useState, useEffect } from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useAppContext } from '../context/AppContext'

const RecommendedHotels = () => {
    const { rooms, searchedCities } = useAppContext();
    const [recommended, setRecommended] = useState([]);

    useEffect(() => {
        // Filter rooms based on searched cities
        const filtered = rooms.filter(room => 
            searchedCities.includes(room.hotel.city)
        );
        setRecommended(filtered);
    }, [rooms, searchedCities]);

    // Don't render if no recommendations
    if (recommended.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20"> 
            <Title 
                title="Recommended Hotels" 
                subtitle="Discover our most popular destinations handpicked from around 
                the region just to suite your liking a preference and book your stay today."
            />
            <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
                {recommended.slice(0, 4).map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index}/>
                ))}
            </div>
        </div>
    );
}

export default RecommendedHotels;