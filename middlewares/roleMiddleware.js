const roleMiddleware = (requiredRoles) => (req, res, next) => {
  if (!requiredRoles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Access denied: Insufficient permissions" });
  }
  next();
};

export default roleMiddleware;
