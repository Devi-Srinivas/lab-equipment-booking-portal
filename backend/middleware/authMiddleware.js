// Authorization check cheyakunda direct gaa mundhuku pampisthundhi
const protect = (req, res, next) => {
    req.user = { id: "12345", username: "testuser" };
    next();
};

module.exports = { protect };