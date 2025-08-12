/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteImage } from "../../config/cloudinary.config";
import { QueryBuilders } from "../../utils/QueryBuilder";
import { divisionSearchField } from "./division.constant";
import { IDivision } from "./division.interface"
import { Division } from "./division.model";

// const baseSlug = name?.toLocaleLowerCase().split(" ").join("-");
// let slug = `${baseSlug}-Division`;
// let counter = 0;
// while (await Division.exists({ slug }))
//     slug = `${slug}-${counter++}`
// payload.slug = slug;

const createDivision = async (payload: Partial<IDivision>) => {
    const { name, ...rest } = payload;

    const create = await Division.create({
        name,
        ...rest, // Spread rest properly
    });

    return create;
};

export const getDivisionData = async (query: Record<string, any>) => {

  // 1️⃣ Initialize query builder with the Division model and incoming query
  const queryBuilder = new QueryBuilders(Division.find(), query);

  // 2️⃣ Chain the operations as needed
  const builtQuery = queryBuilder
    .filter()
    .search(divisionSearchField)
    .sort()
    .field()
    .pagination()
    .build(); // ⬅️ This returns the final Mongoose query

  // 3️⃣ Execute the query
  const divisions = await builtQuery;

  // 4️⃣ Optionally get pagination meta
  const meta = await queryBuilder.getMeta();

  // 5️⃣ Return both data and meta
  return {
    meta,
    data: divisions,
  };
};

const getSigleDIvision = async (slug: string) => {
    const division = await Division.findOne({ slug })
    return {
        data: division
    }
}


const updateDivision = async (id: string, payload: Partial<IDivision>) => {
    // Check if the division exists
    const isDivisionExist = await Division.findById(id);
    if (!isDivisionExist) {
        throw new Error("Division not found");
    }

    // Check for duplicate division name (excluding current one)
    if (payload.name) {
        const duplicateDivision = await Division.findOne({
            _id: { $ne: id },
            name: payload.name
        });

        if (duplicateDivision) {
            throw new Error("A Division with this name already exists");
        }

        // Generate new slug only if name is being updated
        // const baseSlug = payload.name.toLowerCase().split(" ").join("-");
        // let slug = `${baseSlug}-division`;
        // let counter = 0;

        // while (await Division.exists({ slug })) {
        //     slug = `${baseSlug}-division-${counter++}`;
        // }

        // payload.slug = slug;
    }

    // Update division
    const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
        new: true,
    });

    if(payload.thumbnail && isDivisionExist.thumbnail){
        await deleteImage(isDivisionExist.thumbnail)
    }

    return updatedDivision;
};



const deleteDivision = async (id: string) => {
    await Division.findByIdAndDelete(id);
    return null;
}

export const DivisionServices = {
    createDivision,
    getDivisionData,
    getSigleDIvision,
    updateDivision,
    deleteDivision
}