export const onlyAdmin = (req, res, next) => {
  try {
    const user = req.user;
    // console.log("user", user.user);

    if (user?.user?.role !== 1) {
      return res.status(403).json({
        status: false,
        message: "Access denied. Only admin can perform this action.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
