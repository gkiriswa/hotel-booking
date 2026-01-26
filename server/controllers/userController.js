// GET /api/user/

export const getUserData = async (req, res) => {
    try {
    const role = req.user.role;
    const recentSearchedCities = req.user.recentSearchedCities;
    res.json({success: true, role, recentSearchedCities})
    } catch (error) {
    res.json({success: false, message: error.message})
    }
}
// Store User Recent Searched Cities
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        const user = req.user; // Remove 'await' - req.user is not a Promise

        // Validate input
        if (!recentSearchedCity || typeof recentSearchedCity !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Valid city name is required"
            });
        }

        // Initialize array if it doesn't exist
        if (!user.recentSearchedCities) {
            user.recentSearchedCities = [];
        }

        // Remove duplicate if it already exists
        user.recentSearchedCities = user.recentSearchedCities.filter(
            city => city.toLowerCase() !== recentSearchedCity.toLowerCase()
        );

        // Add new city
        user.recentSearchedCities.push(recentSearchedCity);

        // Keep only last 3 cities
        if (user.recentSearchedCities.length > 3) {
            user.recentSearchedCities = user.recentSearchedCities.slice(-3);
        }

        await user.save();

        res.json({
            success: true,
            message: "City added",
            recentSearchedCities: user.recentSearchedCities
        });

    } catch (error) {
        console.error("Error storing recent city:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};