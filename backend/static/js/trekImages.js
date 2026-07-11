
const TREK_IMAGE_MAP = {
    'kedarnath'  : 'https://images.unsplash.com/photo-1612438214708-f428a707dd4e?w=1100&q=80',
    'roopkund'   : 'https://images.unsplash.com/photo-1709623868300-e3b78cad10e1?w=1100&q=80',
    'hampta'     : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1100&q=80',
    'valley'     : 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1100&q=80',
    'snow'       : 'https://images.unsplash.com/photo-1542332213-31f87348057f?w=1100&q=80',
    'forest'     : 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1100&q=80',
    'river'      : 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1100&q=80',
    'lake'       : 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1100&q=80',
    'glacier'    : 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1100&q=80',
    'sunrise'    : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1100&q=80',
    'desert'     : 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1100&q=80',
    'temple'     : 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1100&q=80',
    'manali'     : 'https://images.unsplash.com/photo-1626017740083-3c29e524e3f5?w=1100&q=80',
    'ladakh'     : 'https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?w=1100&q=80',
    'kashmir'    : 'https://images.unsplash.com/photo-1631420105765-caf5ccd069bc?w=1100&q=80',
    'sikkim'     : 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1100&q=80',
    'himachal'   : 'https://images.unsplash.com/photo-1597977084860-23cf629c5588?w=1100&q=80',
    'uttarakhand': 'https://images.unsplash.com/photo-1623838978580-ef52ec53b4b1?w=1100&q=80',
    'chadar'     : 'https://images.unsplash.com/photo-1670977812562-6c51c84410ca?w=1100&q=80',
    'har ki dun' : 'https://images.unsplash.com/photo-1618772446265-3f9f8e6f8487?w=1100&q=80',
    'triund hill' : 'https://images.unsplash.com/photo-1627289496743-8a9a08bb228a?w=1100&q=80',
    'kasol'     :  'https://images.unsplash.com/photo-1612638039814-1a67ea727114?w=1100&q=80',
  }


const DEFAULT_TREK_IMAGE = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=700&q=80'

function getTrekImage(region, title, imageKey='') {
    if (imageKey && imageKey.trim() !== '') {
        const k = imageKey.toLowerCase().trim()
        if (TREK_IMAGE_MAP[k]) return TREK_IMAGE_MAP[k]
    }
    const t = (title || '').toLowerCase()
    for (const key in TREK_IMAGE_MAP) {
        if (t.includes(key)) return TREK_IMAGE_MAP[key]
    }
    const r = (region || '').toLowerCase()
    for (const key in TREK_IMAGE_MAP) {
        if (r.includes(key)) return TREK_IMAGE_MAP[key]
    }
    return DEFAULT_TREK_IMAGE
}
