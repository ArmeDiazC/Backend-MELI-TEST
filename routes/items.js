var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

const author = {
  author: {
    name: "Armed",
    lastname: "Diaz c",
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
    picture: thumbnail,
    condition,
    free_shipping: shipping.free_shipping,
    sold_quantity,
    address: address.state_name,
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
    const json = await response.json();
    const categories = {
      categories: json.filters
        .map(({ values }) => {
          return values.map(({ name }) => name);
        })
        .flat(),
    };
    const list = json.results.slice(0, 4);
    const items = {
      items: list.map((product) => formatProduct(product)),
    };

    // const items2 = list.map((product) => formatProduct(product));
    // const searchResponse = { ...items2 };

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
    const jsonId = await responseId.json();
    const { plain_text } = await responseDescription.json();
    const productData = { ...jsonId, ...plain_text };
    const product = res.json(product);
  } catch (error) {
    console.log(error);
  }
  // // console.log(json);
});

module.exports = router;
