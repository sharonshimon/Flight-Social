import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "./navbarSearch.css";
import axiosInstance from "../../services/axiosService";
import { API_ENDPOINTS } from "../../config/api";
import defaultAvatar from '../../assets/photoplaceholder.jpg';


// list of tags
const predefinedTags = [
    "Adventure", "CityTrip", "Nature", "Luxury", "Backpacking", "FoodAndDrink",
    "Cultural", "Family", "Couples", "SoloTravel", "Budget", "Wellness",
    "RoadTrip", "Festival", "Historical", "Beach", "Mountain", "Wildlife",
    "Cruise", "Skiing", "Hiking", "Camping", "Diving", "Surfing",
    "Cycling", "Photography", "Shopping", "Nightlife", "General", "Other"
];

const NavbarSearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            try {
                const [usersRes, groupsRes] = await Promise.all([
                    axiosInstance.get(API_ENDPOINTS.users.getAllUsers),
                    axiosInstance.get(API_ENDPOINTS.groups.getAllGroups)
                ]);

                const usersData = usersRes.data.data || [];
                const groupsData = groupsRes.data.groups || [];

                const lowerQuery = query.toLowerCase();

                const filteredUsers = usersData.filter(
                    u =>
                        u.username.toLowerCase().includes(lowerQuery) ||
                        `${u.firstName} ${u.lastName}`.toLowerCase().includes(lowerQuery)
                );

                const filteredGroups = groupsData.filter(
                    g => g.name.toLowerCase().includes(lowerQuery)
                );

                const tagMatches = predefinedTags.filter(t =>
                    t.toLowerCase().includes(lowerQuery)
                );

                const combined = [
                    ...filteredUsers.map(u => ({
                        type: "User",
                        label: u.username,
                        id: u._id,
                        image: u.profilePicture || defaultAvatar
                    })),
                    ...filteredGroups.map(g => ({
                        type: "Group",
                        label: g.name,
                        id: g._id,
                        image: g.coverImageUrl || defaultAvatar
                    })),
                    ...tagMatches.map(t => ({ type: "Tag", label: `#${t}` }))
                ];

                setResults(combined);
            } catch (err) {
                console.error("Error fetching search results:", err);
            }
        };

        fetchResults();
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="search" ref={dropdownRef}>
            <SearchOutlinedIcon />
            <input
                type="text"
                placeholder="Search users, groups, or tags..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {results.length > 0 && (
                <div className="search-dropdown">
                    {results.map((item, idx) => (
                        <Link
                            key={idx}
                            to={
                                item.type === "User"
                                    ? `/profile/${item.id}`
                                    : item.type === "Group"
                                        ? `/groups/${item.id}`
                                        : `/posts?tag=${item.label.replace("#", "")}`
                            }
                            className={`search-item ${item.type}`}
                            onClick={() => setQuery("")}
                        >
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.label}
                                    onError={(e) => { e.target.src = defaultAvatar; }}
                                />
                            )}
                            <div className="info">
                                <span>{item.label}</span>
                                <small>{item.type}</small>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NavbarSearch;
