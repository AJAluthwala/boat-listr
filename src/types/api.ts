export type ApiResponse<T> = {
	data?: T;
	error?: string;
	message?: string;
};

export type PaginatedResult<T> = {
	items: T[];
	page: number;
	pageSize: number;
	total: number;
};
