export const validateBody = (schema) => {
  return (req, res, next) => {
    if (Object.keys(req.body).length === 0 && req.file) {
      return next();
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }
    next();
  };
};
