// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

class Product {
  static #list = []

  constructor(name, price, description, id, createDate) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.id = id;
    this.createDate = createDate;
  }

  static generateId = () => {
    const randomId = Math.floor(Math.random() * 90000) + 10000;
    return randomId;
  }

  static getList = () => {
    return this.#list
  }

  static add = (name, price, description) => {
    const id = this.generateId();
    const createDate = new Date().toISOString;
    const product = new Product(name, price, description, id, createDate);
    this.#list.push(product);
    return product;
  }

  static getById = (id) => {
    return this.#list.find(product => product.id === id);
  }

  static updateById(id, data) {
    const product = Product.getById(id);
    if (product) {
      Object.assign(product, data);
      return product;
    }
    return null;
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(product => product.id === id);
    if (index !== -1) {
      return this.#list.splice(index, 1)[0];
    } else {
      return null;
    }
  }
}

// ================================================================

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('success-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'success-info',
    info: 'Користувач створений',
  })
  // ↑↑ сюди вводимо JSON дані
})

// // ================================================================

// router.get('/user-delete', function (req, res) {
//   // res.render генерує нам HTML сторінку

//   const { id } = req.query

//   User.deleteById(Number(id))

//   // ↙️ cюди вводимо назву файлу з сontainer
//   res.render('success-info', {
//     // вказуємо назву папки контейнера, в якій знаходяться наші стилі
//     style: 'success-info',
//     info: 'Користувача видалено',
//   })
//   // ↑↑ сюди вводимо JSON дані
// })

// // ================================================================

// router.post('/user-update', function (req, res) {
//   // res.render генерує нам HTML сторінку

//   const { email, password, id } = req.body

//   let result = false

//   const user = User.getById(Number(id))


//   if (user.verifyPassword(password)) {
//     User.update(user, { email })
//     result = true
//   }

//   // ↙️ cюди вводимо назву файлу з сontainer
//   res.render('success-info', {
//     // вказуємо назву папки контейнера, в якій знаходяться наші стилі
//     style: 'success-info',
//     info: result 
//     ? 'Емайл пошта оновлена'
//     : 'Сталась помилка',
//     // result
//     //   ? 'Дані успішно змінено'
//     //   : 'Виникла помилка',
//   })
//   // ↑↑ сюди вводимо JSON дані
// })

// // Підключаємо роутер до бек-енду

// // Підключаємо роутер до бек-енду
// module.exports = router
