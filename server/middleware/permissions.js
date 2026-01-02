const requirePermission = (permission) => {
  return (req, res, next) => {
    const userPermissions = req.auth.payload.permissions || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ 
        error: `Missing ${permission} permission` 
      });
    }
    
    next();
  };
};

module.exports = { requirePermission };