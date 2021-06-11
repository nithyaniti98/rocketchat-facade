const express = require('express');
const router = express.Router();

// generic route handler - to remove
const genericHandler = (req, res, next) => {
    console.log("in generic")
    res
        .status(501)
        .json({ message: 'Not implemented yet' })
};

router.post('/openTask', genericHandler);

router.post('/closeTask', genericHandler);

module.exports = router;