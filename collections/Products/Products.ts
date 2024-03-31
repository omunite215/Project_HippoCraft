import type { CollectionConfig } from "payload/types";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {},
  fields: [
    {
      name: "users",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => true,
      },
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
  ],
};
