// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class TrackSpotify {
  static #list = []

  constructor(link) {
    this.id = Math.floor(Math.random() * 90000) + 10000
    this.link = link
  }

  static addTrack(track) {
    TrackSpotify.#list.push(track)
  }

  static getRandomTrack() {
    const randomIndex = Math.floor(
      Math.random() * TrackSpotify.#list.length,
    )
    return TrackSpotify.#list[randomIndex]
  }

  static getList() {
    return TrackSpotify.#list
  }
}

const track1 = new TrackSpotify(
  '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/7MnPqlRg4XPv9cqHF76tbs?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
)
const track2 = new TrackSpotify(
  '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/51HCQFTlKHs7w9Fxo9QcjA?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
)
const track3 = new TrackSpotify(
  '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/7fvQ3kv9pCOkFyGdON4k6H?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
)
const track4 = new TrackSpotify(
  '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/539yxbKKHPHrI1vc3BI2Ee?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
)

TrackSpotify.addTrack(track1)
TrackSpotify.addTrack(track2)
TrackSpotify.addTrack(track3)
TrackSpotify.addTrack(track4)

class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 10000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    Track.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return Track.#list.reverse()
  }

  static getById(id) {
    return (
      Track.#list.find((track) => track.id === id) || null
    )
  }
}

Track.create('Yeah', 'Wow', 'https://picsum.photos/100/100')

Track.create(
  'Check',
  'Paul Van Duk',
  'https://picsum.photos/100/100',
)

Track.create(
  'Another',
  'INNA',
  'https://picsum.photos/100/100',
)

Track.create(
  'Test',
  'Monatik',
  'https://picsum.photos/100/100',
)

Track.create('DR', 'RD', 'https://picsum.photos/100/100')

Track.create(
  'TopPot',
  '57',
  'https://picsum.photos/100/100',
)

class Playlist {
  static #list = []

  constructor(name, image, amount) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.amount = amount
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  static create(name, image, amount) {
    const newPlaylist = new Playlist(name, image, amount)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return Playlist.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  updateAmount() {
    this.amount = this.tracks.length
  }

  addTrack(track) {
    if (this.hasTrack(track.id)) {
      console.log('Цей трек вже доданий до плейлиста.')
      return
    }

    this.tracks.push(track)
    this.updateAmount()
  }

  hasTrack(trackId) {
    return this.tracks.some((track) => track.id === trackId)
  }

  static randomImage() {
    const imagesPlaylist = [
      '/img/spotify/close-to-me.jpg',
      '/img/spotify/deep.jpg',
      '/img/spotify/oazo.jpg',
      '/img/spotify-img/list-img1.jpg',
      '/img/spotify-img/list-img5.jpg',
    ]

    const randomImage =
      imagesPlaylist[
        Math.floor(Math.random() * imagesPlaylist.length)
      ]
    return randomImage
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
    this.updateAmount()
  }

  static findListByValue(name) {
    return Playlist.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))

// ================================================================

router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const playlists = Playlist.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-home', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-home',

    data: {
      playlists: playlists, //
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-choose', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',

    data: {
      list: TrackSpotify.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  console.log(isMix)

  res.render('spotify-create', {
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
})

router.post('/spotify-create', function (req, res) {
  console.log(req.body, req.query)
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',

      data: {
        title: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const randomImage = Playlist.randomImage()
  const amount = isMix ? 3 : 0
  const playlist = Playlist.create(
    name,
    randomImage,
    amount,
  )

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
      image: playlist.image,
    },
  })
})

// ================================================================

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id) // Змінено req.query.id на id

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        title: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/`,
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        title: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================

router.get('/spotify-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        title: 'Увага!',
        info: 'Плейліста не знайдено!',
        link: `/spotify-choose`,
      },
    })
  }

  res.render('spotify-add', {
    style: 'spotify-add',

    data: {
      playlistId: playlist.id,
      tracks: Track.getList(),
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        title: 'Увага!',
        info: 'Плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  const track = Track.getById(trackId)

  if (playlist.hasTrack(track.id)) {
    return res.render('alert', {
      style: 'alert',
      data: {
        title: 'Увага',
        info: 'Цей трек вже доданий до плейлиста.',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.addTrack(Track.getById(trackId))

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
