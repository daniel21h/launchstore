const db = require('../../config/db')

module.exports = {
  async all() {
    const results = await db.query(`
    SELECT * FROM products
    ORDER BY updated_at DESC
    `)

    return results.rows
  },
  async create(data) {
    const query = `
      INSERT INTO products (
        category_id,
        user_id,
        name,
        description,
        old_price,
        price,
        quantity,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id
    `

    data.price = data.price.replace(/\D/g, '')

    const values = [
      data.category_id,
      data.user_id || 1,
      data.name,
      data.description,
      data.old_price || data.price,
      data.price,
      data.quantity,
      data.status || 1,
    ]
    const results = await db.query(query, values)

    return results.rows
  },
  async find(id) {
    const results = await db.query(`SELECT * FROM products WHERE id =  $1`, [id])

    return results.rows[0]
  },
  update(data) {
    const query = `
      UPDATE products SET 
        category_id=($1),
        user_id=($2),
        name=($3),
        description=($4),
        old_price=($5),
        price=($6),
        quantity=($7),
        status=($8)        
      WHERE id = $9
      `

    const values = [
      data.category_id,
      data.user_id,
      data.name,
      data.description,
      data.old_price,
      data.price,
      data.quantity,
      data.status,
      data.id
    ]

    return db.query(query, values)
  },
  delete(id) {
    return db.query(`DELETE FROM products WHERE id = $1`, [id])
  },
  async files(id) {
    const results = await db.query(`SELECT * FROM files WHERE product_id = $1`, [id])

    return results.rows
  },
  async search(params) {
    const { filter, category } = params

    let query = '',
      filterQuery = 'WHERE'

    if (category) {
      filterQuery = `
      ${filterQuery}
      products.category_id = ${category_id}
      AND
      `
    }

    filterQuery = `
      ${filterQuery}
      products.name ilike '%${filter}%'
      OR products.description ilike '%${filter}%'
    `

    query = `
        SELECT products.*, 
        categories.name AS categories_name
        FROM products 
        LEFT JOIN categories ON (categories.id = products.category_id)
        ${filterQuery}
        GROUP BY categories.name
      `

    const results = await db.query(query)

    return results.rows
  }
} 