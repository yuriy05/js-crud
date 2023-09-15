// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

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
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      Track.#list.find(
        (track) => track.id === id, 
      ) || null
    )
  }
}

Track.create(
  'Test',
  'Monatik',
  'https://picsum.photos/100/100',
)

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



class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks.sort(() => 0.5 - Math.random()).slice(0, 3)

     playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id, 
      ) || null
    )
  }

  addTrack(track) {
    this.#list.push(track)
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter (
      (track) => track.id !== trackId,
    )
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) => 
      playlist.name.toLowerCase().includes(name.toLowerCase()),
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

    data: {},
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

  if(!name) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Введіть назву плейлиста',
        link: isMix ? '/spotify-create?isMix=true' : '/spotify-create',
      },
    }) 
  }
  
  const playlist = Playlist.create(name)

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
    },
  })
})

// ================================================================

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id); // Змінено req.query.id на id

  const playlist = Playlist.getById(id);

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/`,
      },
    });
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  });
});

router.get('/spotify-track-delete', function(req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if(!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      }
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

router.get('/spotify-search', function(req, res) {
  const value =''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest}) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function(req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest}) => ({
      ...rest,
      amount: tracks.length,
    })),
    value,
    }
  })
})

// ================================================================

router.get('/spotify-add', function(req, res) {
  const tracks = Track.getList();
  const playlists = Playlist.getList();

  res.render('spotify-add', {
    style: 'spotify-add',
    data: {
      tracks: tracks,
      playlists: playlists,
    }
  })
})


// ================================================================

router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId);
  const trackId = Number(req.query.trackId);

  const playlist = Playlist.getById(playlistId);
  const track = Track.getById(trackId);

  if (playlist && track) {
    // Перевірка, чи трек не вже існує у плейлисті
    if (!playlist.tracks.some((t) => t.id === trackId)) {
      // Додайте трек до плейлисту
      playlist.tracks.push(track);
    }

    // Поверніть користувача на сторінку `/spotify-add` з параметром `playlistId`
    return res.redirect(`/spotify-add?playlistId=${playlistId}`);
  } else {
    // Якщо плейлист або трек не знайдено, виведіть помилку
    return res.render('alert', {
      style: 'alert',
      data: {
        title: 'Помилка',
        info: 'Треку або плейлиста не знайдено',
        link: '/',
      },
    });
  }
});


// Підключаємо роутер до бек-енду
module.exports = router
