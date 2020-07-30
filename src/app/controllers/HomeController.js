const { formatPrice } = require('../../lib/utils')

const File = require('../models/File')
const Product = require('../models/Product')

module.exports = {
  async index(req, res){
    let results = await Product.all()
    const products = results.rows
    console.log(products);

    if (!products) return res.send('Products not found!')

    async function getImage(productId) {
      let results = await Product.files()
      let files = results.rows
      files = files.map(file => Product.files(products))

    }

    return res.render('home/index')
  }
}