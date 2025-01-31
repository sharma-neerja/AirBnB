const joi = require('joi');

module.exports.listingSchema = joi.object ({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required().min(0),
        category: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        image: joi.object().allow("", null)
    }).required(),
});

module.exports.reviewSchema = joi.object ({
    review: joi.object({
        rating: joi.number().required().min(0).max(5),
        comment: joi.string().required(),
    }).required(),
});

// module.exports.listingSchema = joi.object ({
//     listing: joi.object({
//         title: joi.string().required(),
//         description: joi.string().required(),
//         price: joi.number().required().min(0),
//         image: joi.string().required(),
//         location: joi.string().required(),
//         country: joi.string().required(),
//         image:joi.string().allow("", null)
//     }).required(),
// });