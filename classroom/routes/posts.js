const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("GET request on posts")
});
router.post("/", (req, res) => {
    res.send("POST request on posts")
});
router.delete("/:id", (req, res) => {
    res.send("DELETE request on posts")
});
router.put("/:id/edit", (req, res) => {
    res.send("PUT request on posts")
});

module.exports = router;