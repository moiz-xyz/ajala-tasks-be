import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user data to request
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      return next(); // Return here to stop execution
    } catch (error) {
      console.error("Token Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If we reach here, it means no token was found
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
