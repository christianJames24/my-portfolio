const express = require('express');
const app = express();

app.get('/api', (req, res) => {
    res.json({"users": ["user1", "user2", "user3"]})
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
