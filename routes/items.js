var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

const author = {
  author: {
    name: "Armed",
    lastname: "Diaz C.",
  },
};

const formatProduct = ({
  id,
  title,
  price,
  currency_id,
  sold_quantity,
  condition,
  thumbnail,
  address,
  shipping,
  seller_address,
  pictures,
}) => {
  return {
    id,
    title,
    price: {
      currency: currency_id,
      amount: Math.floor(price),
      decimals:
        Math.floor(price) !== price
          ? Number(price.toString().match(/[^.]*$/))
          : 0,
    },
    picture: pictures ? pictures[0].url : thumbnail,
    condition,
    free_shipping: shipping.free_shipping,
    sold_quantity,
    address: address ? address.state_name : seller_address.state.name,
  };
};

/* GET home page. */
router.get("/", async (req, res, next) => {
  // res.render('index', { title: 'Express' });
  try {
    console.log(req);
    const response = await fetch(
      `https://api.mercadolibre.com/sites/MLA/search?q=${req.query.q}`
    );
    const jsonSearch = await response.json();

    const categories = {
      categories: jsonSearch.filters
        .map(({ values }) => {
          return values.map(({ name }) => name);
        })
        .flat(),
    };
    const list = jsonSearch.results.slice(0, 4);
    const items = {
      items: list.map((product) => formatProduct(product)),
    };

    const searchResponse = { ...author, ...items, ...categories };
    // console.log(json);
    res.json(searchResponse);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res, next) => {
  // res.render('index', { title: 'Express' });
  try {
    console.log(req);
    const responseId = await fetch(
      `https://api.mercadolibre.com/items/${req.params.id}`
    );
    const responseDescription = await fetch(
      `https://api.mercadolibre.com/items/${req.params.id}/description`
    );
    const dataProduct = await responseId.json();
    const descriptionProduct = await responseDescription.json();

    const product = { items: formatProduct(dataProduct) };
    product.items.description = descriptionProduct.plain_text;

    const productResponse = { ...author, ...product };

    res.json(productResponse);
  } catch (error) {
    console.log(error);
  }
  // // console.log(json);
});

module.exports = router;
