import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: false, unique: true },
    thumbnail: { type: String, required: false },
    description: { type: String, required: false }
}, {
    timestamps: true,
    versionKey: false
})

// const divisionUpdateSchema = 

divisionSchema.pre("save", async function (next) {
    if (this.isModified("name") && this.name) {
        const baseSlug = this.name.toLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`;
        let counter = 0;

        while (await Division.exists({ slug })) {
            slug = `${baseSlug}-division-${counter++}`;
        }

        this.slug = slug;
    }

    next();
});


divisionSchema.pre("findOneAndUpdate", async function (next) {
    const division = this.getUpdate() as Partial<IDivision>
    if (division.name) {
        const baseSlug = division.name.toLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`;
        let counter = 0;
        while (await Division.exists({ slug })) {
            slug = `${baseSlug}-division-${counter++}`;
        }
        division.slug = slug}
        
    this.setUpdate(division)
    next()
})


export const Division = model<IDivision>("Division", divisionSchema)