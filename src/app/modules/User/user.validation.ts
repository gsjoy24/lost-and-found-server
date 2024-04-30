import { z } from 'zod';

const createUser = z.object({
	body: z.object({
		name: z
			.string({
				required_error: 'Name is required!'
			})
			.min(3, {
				message: 'Name must be at least 3 characters!'
			})
			.max(255),
		email: z
			.string({
				required_error: 'Email is required!'
			})
			.email({
				message: 'Invalid email address!'
			}),
		password: z
			.string({
				required_error: 'Password is required!'
			})
			.min(6, {
				message: 'Password must be at least 6 characters!'
			})
			.max(25, {
				message: 'Password must be at most 25 characters!'
			}),
		profile: z.object(
			{
				bio: z
					.string({
						required_error: 'Bio is required!',
						invalid_type_error: 'Bio must be a string!'
					})
					.max(255),
				age: z
					.number({
						required_error: 'Age is required!',
						invalid_type_error: 'Age must be a number!'
					})
					.int({
						message: 'Age must be an integer!'
					})
					.positive({
						message: 'Age must be a positive number!'
					})
			},
			{
				required_error: 'Profile data is required!'
			}
		)
	})
});

const loginUser = z.object({
	body: z.object({
		email: z
			.string({
				required_error: 'Email is required!'
			})
			.email({
				message: 'Invalid email address!'
			}),
		password: z.string({
			required_error: 'Password is required!'
		})
	})
});

const userValidationSchemas = {
	createUser,
	loginUser
};

export default userValidationSchemas;
