import React, { useEffect, useState } from "react";
import statsService from "../../services/statsService";
import PostsByCountryMap from "../../components/StatsDashboard/PostsByCountryMap";
import AvgLikesByGroup from "../../components/StatsDashboard/AvgLikesByGroup";
import PostsByMonth from "../../components/StatsDashboard/PostsByMonth";

const StatsDashboard = () => {
    const [postsByCountry, setPostsByCountry] = useState([]);
    const [avgLikesByGroup, setAvgLikesByGroup] = useState([]);
    const [postsByMonth, setPostsByMonth] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);

                const [countryData, likesData, monthData] = await Promise.all([
                    statsService.getPostsByCountry(),
                    statsService.getAvgLikesByGroup(),
                    statsService.getPostsByMonth()
                ]);

                setPostsByCountry(countryData);
                setAvgLikesByGroup(likesData);
                setPostsByMonth(monthData);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
                setError("Failed to load statistics. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <p>Loading statistics...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>📊 Statistics Dashboard</h1>

            <section>
                <h2>🌍 Posts by Country</h2>
                <PostsByCountryMap data={postsByCountry} />
            </section>

            <section>
                <h2>💗 Average Likes by Group</h2>
                <AvgLikesByGroup data={avgLikesByGroup} />
            </section>

            <section>
                <h2>📅 Posts by Month</h2>
                <PostsByMonth data={postsByMonth} />
            </section>
        </div>
    );
};

export default StatsDashboard;
