"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ReportFoundItem = zod_1.z.object({
    body: zod_1.z.object({
        categoryId: zod_1.z.string({
            required_error: 'Category id is required'
        }),
        itemName: zod_1.z
            .string({
            required_error: 'Found item name is required'
        })
            .min(5, {
            message: 'Found item name must be at least 5 characters long'
        }),
        description: zod_1.z
            .string({
            required_error: 'Description is required'
        })
            .min(5, {
            message: 'Description must be at least 5 characters long'
        }),
        location: zod_1.z.string({
            required_error: 'Location is required'
        }),
        pictures: zod_1.z.array(zod_1.z.string()),
        foundDate: zod_1.z.string({
            required_error: 'Found date is required'
        })
    })
});
const UpdateFoundItem = zod_1.z.object({
    body: zod_1.z.object({
        categoryId: zod_1.z.string().optional(),
        itemName: zod_1.z
            .string()
            .min(5, {
            message: 'Found item name must be at least 5 characters long'
        })
            .optional(),
        description: zod_1.z
            .string()
            .min(5, {
            message: 'Description must be at least 5 characters long'
        })
            .optional(),
        location: zod_1.z.string().optional(),
        pictures: zod_1.z.array(zod_1.z.string()).optional(),
        foundDate: zod_1.z.string().optional(),
        isReturned: zod_1.z.boolean().optional()
    })
});
const ReportItemValidations = {
    ReportFoundItem,
    UpdateFoundItem
};
exports.default = ReportItemValidations;
