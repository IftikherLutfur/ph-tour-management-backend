/* eslint-disable no-self-assign */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { Query } from "mongoose";
import { excludeField } from "../modules/tour/tour.constant";

export class QueryBuilders<T> {
    public modelQuery: Query<T[], T>;
    public readonly query: Record<string, string> | undefined

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery
        this.query = query
    }

    filter(): this {
        const filter = { ...this.query }
        for (const field of excludeField) {
            delete filter[field]
        }
        this.modelQuery = this.modelQuery.find(filter)
        return this
    }

    search(searchField: string[]): this {
        const searchTerm = this.query?.searchTerm || "";
        const searchQuery = {
            $or: searchField.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
        }
        this.modelQuery = this.modelQuery.find(searchQuery)
        return this;
    }

    sort(): this {
        const sort = this.query?.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this
    }

    field(): this {
        const fields = this.query?.fields?.split(",").join(" ") || "";
        this.modelQuery = this.modelQuery?.select(fields)
        return this
    }

    pagination(): this {
        const page = Number(this.query?.page) || 1;
        const limit = Number(this.query?.limit) || 10;
        const skip = (page - 1) * limit

        this.modelQuery = this.modelQuery.skip(skip)
        return this
    }

    build(){
     return this.modelQuery
    }

    async getMeta(){
        const totalTours = await this.modelQuery.model.countDocuments();
        const page = Number(this.query?.page) || 1;
        const limit = Number(this.query?.limit) || 10;
         const totalPage = Math.ceil(totalTours / limit)
         return {page, limit, total: totalTours, totalPage}
    }

}