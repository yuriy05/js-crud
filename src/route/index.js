// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Product.generateId()
    this.createDate = new Date().toISOString
  }

  static generateId = () => {
    const randomId =
      Math.floor(Math.random() * 90000) + 10000
    return randomId
  }

  static getList = () => {
    return this.#list
  }

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static updateById(id, data) {
    const product = Product.getById(id)
    if (product) {
      Object.assign(product, data)
      return product
    }
    return null
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      return this.#list.splice(index, 1)[0]
    } else {
      return null
    }
  }
}

// ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  const list = Product.getList()

  res.render('index', {
    style: 'index',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

router.post('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    title: 'Успішне виконання дії',
    info: 'Товар було успішно створено',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})
// ↑↑ сюди вводимо JSON дані

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query // Отримуємо id з запиту

  const parsedProductId = parseInt(id)

  const product = Product.getById(parsedProductId)

  if (product) {
    res.render('product-edit', {
      product,
      style: 'product-edit',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Товар з таким ID не знайдено',
    })
  }
})

// ================================================================

router.post('/product-edit', (req, res) => {
  const { id, name, price, description } = req.body

  const parsedProductId = parseInt(id)

  const updatedProduct = Product.updateById(
    parsedProductId,
    { name, price, description },
  )

  if (updatedProduct) {
    res.redirect('/product-list')
  } else {
    res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Товар з таким ID не знайдено',
    })
  }
})
// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  const parsedProductId = parseInt(id)

  const deletedProduct = Product.deleteById(parsedProductId)

  if (deletedProduct) {
    res.render('alert', {
      style: 'alert',
      title: 'Успіх',
      info: 'Товар видалено',
    })
  } else {
    res.render('alert', {
      style: 'alert error',
      title: 'Помилка',
      info: 'Товар з таким ID не знайдено',
    })
  }
})
// Підключаємо роутер до бек-енду
module.exports = router
