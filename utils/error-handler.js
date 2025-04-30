// Helper to wrap async routes to properly handle errors
export const wrapHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
