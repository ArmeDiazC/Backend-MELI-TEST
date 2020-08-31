var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

/* GET category listing. */
router.get("/:id", async (req, res, next) => {
  try {
    const responseProduct = await fetch(
      `https://api.mercadolibre.com/items/${req.params.id}`
    );
    const dataProduct = await responseProduct.json();
    const categoryId = dataProduct.category_id;

    const responseCategoy = await fetch(
      `https://api.mercadolibre.com/categories/${categoryId}`
    );
    const categoryJson = await responseCategoy.json();
    const categories = categoryJson.path_from_root.map(
      (categor) => categor.name
    );
    res.json(categories);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
