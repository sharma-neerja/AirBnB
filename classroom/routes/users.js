const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("GET request on users");
});
router.post("/", (req, res) => {
    res.send("POST request on users")
});
router.delete("/:id", (req, res) => {
    res.send("DELETE request on users");
});
router.put("/:id/edit", (req, res) => {
    res.send("PUT request on users")
});

module.exports = router;