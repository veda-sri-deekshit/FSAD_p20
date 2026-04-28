export const getHealth = (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
};

export const getWelcome = (req, res) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
  });
};
