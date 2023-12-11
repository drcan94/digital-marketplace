import { CollectionConfig } from "payload/types";
import { yourOwn } from "./access-control";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "Your Orders",
    description: "A summary of all your orders on DigitalHippo.",
  },
  access: {
    read: yourOwn,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
    create: ({ req }) => req.user.role === "admin",
  },
  fields: [
    {
      name: "_isPaid",
      type: "checkbox",
      access: {
        read: ({ req }) => req.user.role === "admin",
        create: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      admin: {
        hidden: true,
      },
      relationTo: "users",
      required: true,
    },
    {
      name: "orderedProducts",
      type: "array",
      required: true,
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
          hasMany: false,
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          /*
            The "quantity" field within the "orderedProducts" array is technically unnecessary.
            In fact, it could have been simply "product" without specifying the quantity. instead of orderedProducts...
            However, in scenarios where tangible, physically shipped products with actual inventory deductions are involved,
            having a "quantity" field becomes essential. 
            While in this specific project it might not be utilized, it could prove useful in other projects 
            where tracking the quantity of each ordered item is crucial for inventory management and fulfillment processes.
          */
        },
      ],
    },
  ],
};
