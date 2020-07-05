import { Client } from "https://deno.land/x/postgres/mod.ts";
import { dbCreds } from "../config.ts";

//Initialize client
const client = new Client(dbCreds);
interface Product {
  name: string;
  description: string;
  price: number;
}
//GET ALL PRODUCTS
const getProducts = async ({ response }: { response: any }) => {
  try {
    await client.connect();
    let products: Array<Product> = [];
    const result = await client.query("SELECT * from sample_table");
    result.rows.map((p) => {
      let obj: any = new Object();
      result.rowDescription.columns.map((el, i) => {
        obj[el.name] = p[i];
      });
      products.push(obj);
    });
    response.status = 200;
    response.body = {
      success: true,
      body: products,
    };
  } catch (error) {
    response.status = 404;
    response.body = {
      success: false,
      msg: error.toString(),
    };
  }
};

//POST ALL PRODUCTS
const addProducts = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const product = body.value;
  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      data: "No data found",
    };
  } else {
    try {
      await client.connect();
      const result = await client.query(
        "INSERT INTO sample_table(name,description, price) VALUES($1,$2,$3);",
        product.name,
        product.description,
        product.price
      );
      response.status = 201;
      response.body = {
        success: true,
        data: product,
      };
    } catch (error) {
      response.status = 500;
      response.body = {
        success: false,
        message: error.toString(),
      };
    } finally {
      await client.end();
    }
  }
};

//UPDATE ALL PRODUCTS
const updateProduct = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  await getProduct({ params: { id: params.id }, response });
  if (response.status === 404) {
    response.status = 404;
    response.body = {
      success: false,
      msg: response.body.msg,
    };
    return;
  } else {
    const body = await request.body();
    const product = body.value;
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        data: "No data found",
      };
    } else {
      try {
        await client.connect();
        const result = await client.query(
          "UPDATE sample_table SET name=$1, description=$2, price=$3 WHERE id =$4",
          product.name,
          product.description,
          product.price,
          params.id
        );
        response.status = 200;
        response.body = {
          success: true,
          data: product,
        };
      } catch (error) {
        response.status = 500;
        response.body = {
          success: false,
          message: error.toString(),
        };
      } finally {
        await client.end();
      }
    }
  }
};

//GET SINGLE PRODUCT
const getProduct = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  try {
    await client.connect();
    const result = await client.query(
      "SELECT * FROM sample_table WHERE id=$1",
      params.id
    );
    if (result.rows.toString() === "") {
      response.status = 404;
      response.body = {
        success: false,
        msg: `Data not found with id ${params.id}`,
      };
    } else {
      let obj: any = new Object();
      result.rows.map((p) => {
        result.rowDescription.columns.map((el, i) => {
          obj[el.name] = p[i];
        });
      });
      response.status = 200;
      response.body = {
        success: true,
        data: obj,
      };
    }
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      msg: error.toString(),
    };
  } finally {
    await client.end();
  }
};

//DELETE ALL PRODUCTS
const delProducts = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  try {
    await client.connect();
    const result = await client.query(
      "DELETE FROM sample_table WHERE id=$1",
      params.id
    );
    response.body = {
      success: true,
      msg: "Product with given id got deleted from Data",
    };
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      msg: error.toString(),
    };
  } finally {
    await client.end();
  }
};

export { addProducts, getProduct, getProducts, updateProduct, delProducts };
