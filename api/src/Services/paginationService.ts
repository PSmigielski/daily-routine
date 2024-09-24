import ApiErrorException from "../Exceptions/ApiErrorException";

const paginationService = (page: number, limit: number, count: number) => {
	if (page < 0) {
		throw new ApiErrorException("page number can't be negative", 400);
	}
	if (page * limit > count) {
		throw new ApiErrorException("page overflow", 400);
	}
};

export default paginationService;
