import { getRecentActivities } from "../service/recentActivityService.js";

export const getRecentActivitiesById = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const result = await getRecentActivities(userId);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
