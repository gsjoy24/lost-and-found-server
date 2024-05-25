import { LostItem, Prisma, User } from '@prisma/client';
import { QueryOptions } from '../../types';
import prisma from '../../utils/prisma';
import { lostItemSearchableFields } from './lostItem.constant';

const ReportLostItem = async (reportItem: LostItem, userData: User) => {
	// check if the category exists
	await prisma.category.findUniqueOrThrow({
		where: {
			id: reportItem.categoryId
		}
	});

	const newReportItem = await prisma.lostItem.create({
		data: {
			...reportItem,
			userId: userData.id
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					createdAt: true,
					updatedAt: true
				}
			},
			category: true
		}
	});

	return newReportItem;
};

const GetLostItems = async (query: any, options: QueryOptions) => {
	const { searchTerm, ...restQueryData } = query;

	const page: number = Number(options.page) || 1;
	const limit: number = Number(options.limit) || 10;
	const skip: number = (Number(page) - 1) * limit;

	const sortBy: string = options.sortBy || 'createdAt';
	const sortOrder: string = options.sortOrder || 'desc';

	const conditions: Prisma.LostItemWhereInput[] = [];

	if (searchTerm) {
		conditions.push({
			OR: lostItemSearchableFields.map((field) => ({
				[field]: { contains: searchTerm, mode: 'insensitive' }
			}))
		});
	}

	if (Object.keys(restQueryData).length) {
		conditions.push({
			AND: Object.keys(restQueryData).map((key) => ({
				[key]: {
					equals: (restQueryData as any)[key]
				}
			}))
		});
	}

	const lostItems = await prisma.lostItem.findMany({
		where: { AND: conditions },
		skip,
		take: limit,
		orderBy: {
			[sortBy]: sortOrder
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true
				}
			},
			category: true
		}
	});

	const total = await prisma.lostItem.count({
		where: { AND: conditions }
	});

	return {
		meta: {
			limit,
			page,
			total
		},
		lostItems
	};
};

const GetSingleLostItem = async (id: string) => {
	const item = await prisma.lostItem.findUniqueOrThrow({
		where: {
			id
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true
				}
			},
			category: true
		}
	});

	return item;
};

const DeleteLostItem = async (id: string, user: User) => {
	const item = await prisma.lostItem.findUnique({
		where: {
			id
		}
	});

	if (!item) {
		throw new Error('Item not found!');
	}

	// admin can delete any item, user can delete only their items
	if (item.userId !== user.id && user.role !== 'ADMIN') {
		throw new Error('You are not authorized to delete this item!');
	}

	await prisma.lostItem.delete({
		where: {
			id
		}
	});

	return true;
};

const UpdateLostItem = async (id: string, data: any, user: User) => {
	const item = await prisma.lostItem.findUnique({
		where: {
			id
		}
	});

	if (!item) {
		throw new Error('Item not found!');
	}

	// admin can update any item, user can update only their items
	if (item.userId !== user.id && user.role !== 'ADMIN') {
		throw new Error('You are not authorized to update this item!');
	}

	const updatedItem = await prisma.lostItem.update({
		where: {
			id
		},
		data: {
			...data
		}
	});

	return updatedItem;
};

const LostItemServices = {
	ReportLostItem,
	GetLostItems,
	GetSingleLostItem,
	UpdateLostItem,
	DeleteLostItem
};

export default LostItemServices;