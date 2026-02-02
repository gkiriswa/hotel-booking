import React, { useState } from 'react'
import { assets, facilityIcons, roomsDummyData } from '../assets/assets'
import StarRating from '../components/StarRating';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo } from "react";
import { useAppContext } from '../context/AppContext';


/*const Checkbox = ({ label, selected = false, onChange = () => {} }) => {
    return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm"> 
        <input type = "checkbox" selected = {selected} onChange={(e)=>onChange(e.target.checked, label)} />
        <span className='font-light select-none'> {label}</span>

    </label>)*/
const Checkbox = ({ label, selected, onChange, type }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label, type)}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);


const RadioButton = ({ label, selected, onChange }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={() => onChange(label)}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

const AllRooms = () => {
    const [ searchParams, setSearchParams] = useSearchParams()
    const {rooms, navigate, currency} = useAppContext();
    const [openFilters, setOpenFilters] = useState (false);

    const [selectedFilters, setSelectedFilters] = useState({
      roomType: [],
      priceRange: [],
    });

    const roomTypes = [
        "Single Bed",
        "Double Bed",
        "Luxury Suite",
        "Family Suite"
    ];

     const priceRange = [
        { label: "0 to 500", min: 0, max: 500 },
        { label: "500 to 1000", min: 500, max: 1000 },
        { label: "1000 to 2000", min: 1000, max: 2000 },
        { label: "2000 to 3000", min: 2000, max: 3000 },
    ];

    const sortOptions = [
        'Price: Low to High',
        'Price: High to Low',
        'Newest First'
    ];

    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [selectedSort, setSelectedSort] = useState("");

   /* const toggleItem = (value, setFn) => {
        setFn(prev =>
         prev.includes(value)
          ? prev.filter(v => v !== value)
                                        : [...prev, value]
                        );
};

const filteredRooms = useMemo(() => {
  let rooms = [...roomsDummyData];

  // Filter by room type
  if (selectedRoomTypes.length) {
    rooms = rooms.filter(room =>
      selectedRoomTypes.includes(room.type)
    );
  }

  // Filter by price
  if (selectedPriceRanges.length) {
    rooms = rooms.filter(room =>
      priceRanges.some(range =>
        selectedPriceRanges.includes(range.label) &&
        room.pricePerNight >= range.min &&
        room.pricePerNight < range.max
      )
    );
  }

  // Sort
  if (selectedSort === "price-asc") {
    rooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
  }

  if (selectedSort === "price-desc") {
    rooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
  }

  return rooms;
   }, [selectedRoomTypes, selectedPriceRanges, selectedSort]);*/
  
   // Handle changes for filters and sorting
   const handleFilterChange = (checked, value, type) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            
            // Ensure the array exists
            if (!updatedFilters[type]) {
                updatedFilters[type] = [];
            }
            
            if (checked) {
                // Add value if not already present
                if (!updatedFilters[type].includes(value)) {
                    updatedFilters[type].push(value);
                }
            } else {
                // Remove value
                updatedFilters[type] = updatedFilters[type].filter(item => item !== value);
            }
            
            return updatedFilters;
    })
}
const handleSortChange = (sortOption)=> {
  setSelectedSort(sortOption);
}
const matchesRoomType = (room)=>{
  return selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes(room.roomType);
}

   const matchesPriceRange = (room) => {
        if (selectedFilters.priceRange.length === 0) return true;
        
        return selectedFilters.priceRange.some(rangeLabel => {
            // Find the price range object that matches the label
            const range = priceRange.find(r => r.label === rangeLabel);
            if (!range) return false;
            
            return room.pricePerNight >= range.min && room.pricePerNight <= range.max;
        });
}
  const sortRooms = (a, b) =>{
    if (selectedSort === 'Price: Low to High'){
      return a.pricePerNight - b.pricePerNight;
    }
    if (selectedSort === 'Price: High to Low'){
      return b.pricePerNight - a.pricePerNight;
    }
    if (selectedSort === 'Newest First'){
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    return 0;
  }

  //Filter Destination
  const filterDestination = (room)=> {
    const destination = searchParams.get('destination');
    if(!destination) return true;
    return room.hotel.city.toLowerCase().includes(destination.toLocaleLowerCase())
  }
  const filteredRooms = useMemo(()=> {
    return rooms.filter(room => matchesRoomType(room) && matchesPriceRange(room) 
  && filterDestination(room)).sort(sortRooms);
  },[rooms, selectedFilters, selectedSort, searchParams])

  const clearFilters = () => {
    setSelectedFilters({
      roomType: [],
      priceRange: [],
    });
    setSelectedSort('');
    setSearchParams({});
  }
  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
       <div>
        <div className="flex flex-col items-start text-left">
            <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
            <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174" >Explore our diverse selection of rooms designed to provide comfort and luxury for every guest.</p>
        </div>

        {filteredRooms.map((room) => (
        <div key={room._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
            <img onClick={() => {navigate (`/rooms/${room._id}`); scrollTo(0,0);}}
            src={room.images [0]} alt="hotel-image" title='View Room Details'
            className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'/>

            <div className='md:w-1/2 flex flex-col gap-2'>
                <p className='text-gray-500'>{room.hotel.city}</p>
                <p onClick={() => {navigate (`/rooms/${room._id}`); scrollTo(0,0);}}
                className='text-gray-800 text-3xl font-playfair cursor-pointer'>{room.hotel.name}</p>
                <div className='flex items-center'>
                    <StarRating rating={room.rating}/>
                    <p className='ml-2'> 200+ reviews</p>

                </div>
                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                    <img src={assets.locationIcon} alt="location-icon" />
                    <span>{room.hotel.address}</span>
                </div>
                {/* Room Amenities */}
                <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                    {room.amenities.slice(0, 4).map((item, index) => (

                        <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                        <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                         <p className='text-xs'>{item}</p>   
                            
                        </div>
                    ))}
                </div>
                {/* Room Price per night */}
                <p className='text-xl font-medium text-gray-700'>${room.pricePerNight} / night</p> 
            </div>
        </div>    
        ))}
        {/*Filters Section*/}
       </div>
       <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>
        <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && "border-b"}`}> 
            <p className='text-base font-medium text-gray-800'>FILTERS</p>
            <div className='text-xs cursor-pointer'>
                <span onClick={()=> setOpenFilters(!openFilters)} className='lg:hidden'>
                    {openFilters ? 'HIDE' : 'SHOW'} </span>
                <span className='hidden lg:block'>CLEAR</span>
            </div>
        </div>

        <div className={`${openFilters ? 'h-auto' : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
            <div className='px-5 pt-5'>
                <p className='text-gray-800 font-medium pb-2'>Popular Filters</p>
                    {roomTypes.map((roomType, index) => (
                        <Checkbox 
                            key={index} 
                            label={roomType} 
                            type="roomType"
                            selected={selectedFilters.roomType.includes(roomType)} 
                            onChange={handleFilterChange}
                        />
                    ))}
                </div>
            <div className='px-5 pt-5'>
                <p className='text-gray-800 font-medium pb-2'>Price Range</p>
                 {priceRange.map((range, index) => (
                      <Checkbox 
                          key={index} 
                          label={`$${range.label}`} 
                          type="priceRange"
                          selected={selectedFilters.priceRange.includes(range.label)} 
                          onChange={(checked) => handleFilterChange(checked, range.label, 'priceRange')}
                      />
                  ))}
                </div>
            <div className='px-5 pt-5 pb-7'>
                <p className='text-gray-800 font-medium pb-2'>Sort Options</p>
                {sortOptions.map((option, index)=>(
                    <RadioButton key={index} label={option} selected={selectedSort === option}
                     onChange={() => handleSortChange(option)}/>
                ))}
                </div>

        </div>
       </div>
    </div>
  )
}

export default AllRooms