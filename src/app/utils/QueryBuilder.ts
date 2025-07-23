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
        this.modelQuery=this.modelQuery.find(filter)
        return this
    }

    search(searchField: string[]): this{
        const searchTerm = this.query?.searchTerm || "";
        const searchQuery ={
            $or: searchField.map(field=> ({[field]: {$regex: searchTerm, $options: "i"}}))
        }
        this.modelQuery = this.modelQuery.find(searchQuery)
        return this;
    }

}