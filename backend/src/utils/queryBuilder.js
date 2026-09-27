/**
 * Advanced API Features & Query Builder
 * Provides chainable, declarative query composition for Mongoose models:
 * - Filtering (including MongoDB comparison operators gte, gt, lte, lt, in)
 * - Full-text and regex search
 * - Dynamic multi-field sorting
 * - Projection/field selection
 * - Pagination with metadata calculation
 */
export class QueryBuilder {
  /**
   * @param {import('mongoose').Query} mongooseQuery - Mongoose query object
   * @param {Object} queryString - Express req.query object
   */
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = { ...queryString };
    this.paginationMeta = {};
  }

  /**
   * Filter out reserved query parameters and parse MongoDB comparison operators
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Handle range operators like ?price[gte]=50 -> {"price":{"$gte":"50"}}
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|ne)\b/g, (match) => `$${match}`);

    const parsedQuery = JSON.parse(queryStr);

    this.mongooseQuery = this.mongooseQuery.find(parsedQuery);
    return this;
  }

  /**
   * Regex-based search across specified string fields
   * @param {string[]} searchFields - List of model fields to search within
   */
  search(searchFields = ['name', 'description', 'category']) {
    if (this.queryString.search && searchFields.length > 0) {
      const searchRegex = new RegExp(this.queryString.search.trim(), 'i');
      const orConditions = searchFields.map((field) => ({
        [field]: searchRegex,
      }));

      this.mongooseQuery = this.mongooseQuery.find({ $or: orConditions });
    }
    return this;
  }

  /**
   * Sort results by comma-separated fields (e.g. ?sort=-price,rating)
   * Default: newest first (-createdAt)
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  /**
   * Field limiting / projection (e.g. ?fields=name,price,category)
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }

  /**
   * Paginate query results with page & limit
   * @param {number} [defaultLimit=12]
   */
  paginate(defaultLimit = 12) {
    const page = Math.max(1, parseInt(this.queryString.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(this.queryString.limit, 10) || defaultLimit));
    const skip = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationMeta = {
      page,
      limit,
      skip,
    };

    return this;
  }

  /**
   * Execute query and calculate pagination meta against total document count
   * @param {import('mongoose').Model} model - Base Mongoose model for countDocuments
   * @returns {Promise<{ data: Array, meta: Object }>}
   */
  async executeWithMeta(model) {
    // Clone conditions for total matching count
    const filterConditions = this.mongooseQuery.getFilter();
    const totalRecords = await model.countDocuments(filterConditions);

    const data = await this.mongooseQuery;

    const page = this.paginationMeta.page || 1;
    const limit = this.paginationMeta.limit || data.length || 10;
    const totalPages = Math.ceil(totalRecords / limit) || 1;

    return {
      data,
      meta: {
        page,
        limit,
        totalRecords,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}
