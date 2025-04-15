import { json } from "@remix-run/node";
import { authenticate } from "~/utils/auth.server";


export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
//   const { cors } = await authenticate.public(request);
  const query = `mutation UpdateProductVariantPrice {
  productVariantsBulkUpdate(
    productId: "gid://shopify/Product/7636925743213",
    variants: [
      {
        id: "${request.body.productVariantId}",
        price: "${request.body.charges}",
      }
    ]
  ) {
    product {
      id
      title
    }
    productVariants {
      id
      price
    }
    userErrors {
      field
      message
    }
  }
}`;
  const response = admin.graphql(query);
  const data = await response.json();

  console.log({ data });
  return data;
//   return cors(json({ data }));
};