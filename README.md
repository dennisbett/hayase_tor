# Hayase 1337x Torrent Extension

Official 1337x torrent provider extension for **Hayase** and **Shiru** media torrent applications.

## 🚀 Features

- **Full Search Support**: Query 1337x torrents with title, seeders, leechers, file size, uploader, and date.
- **Category Filtering**: Filter by `anime`, `movie`, `show`, `games`, `music`, `apps`, `other`, or `all`.
- **Seeders Sorting**: Automatically uses sorted-by-seeders endpoints to bring highest-seeded torrents to top.
- **Mirror Domain Support**: Configurable fallback across mirrors (`1337x.to`, `1337x.st`, `1337x.ws`, `1337x.eu`, `1337x.se`, `1337x.is`, `1337x.gd`).
- **Magnet Link Resolver**: On-demand detail page parsing to retrieve full `magnet:?xt=urn:btih:...` torrent strings.
- **Resilient Fallback Parser**: Dual DOMParser and Regex parsing engine ensures non-blocking safety even without browser DOM.

---

## 📦 Installation in Hayase

To install this extension in Hayase:

1. Open **Hayase Application**.
2. Navigate to **Settings** -> **Extensions** (or **Providers**).
3. Click **Add Extension Repository** or **Import Extension**.
4. Paste the raw GitHub URL to `index.json`:
   ```text
   https://github.com/dennisbett/hayase_tor/blob/main/hayase/index.json
   ```
5. Click **Fetch / Install**. Hayase will load the manifest and register the `1337x.js` provider.

---

## 📁 Repository Structure

```text
├── hayase/
│   ├── index.json    # Extension repository manifest
│   └── 1337x.js      # Main provider script export
├── test.js           # Node.js validation test script
├── server.ts         # Express server proxy and testing endpoint
├── README.md         # Documentation
└── package.json      # Dependencies and scripts
```

---

## 🛠️ API & Function Signature

### Extension Metadata
```js
import { metadata } from './hayase/1337x.js';

console.log(metadata.id);      // "1337x"
console.log(metadata.mirrors); // ["https://1337x.to", "https://1337x.st", ...]
```

### Search Method
```js
import { search } from './hayase/1337x.js';

const results = await search({
  query: "Cyberpunk 2077",
  category: "games",         // 'anime' | 'movie' | 'show' | 'games' | 'music' | 'apps' | 'other'
  mirror: "https://1337x.st", // Optional mirror override
  page: 1
});

console.log(results);
/*
[
  {
    id: "1337x:1234567",
    title: "Cyberpunk 2077 v2.12 MULTi15",
    url: "https://1337x.st/torrent/1234567/Cyberpunk-2077-v2-12/",
    path: "/torrent/1234567/Cyberpunk-2077-v2-12/",
    seeders: 1420,
    leechers: 85,
    size: "64.2 GB",
    date: "Aug. 10th '26",
    uploader: "FitGirl",
    provider: "1337x",
    magnet: null
  }
]
*/
```

### Resolve Magnet Link
```js
import { resolveMagnet } from './hayase/1337x.js';

const magnet = await resolveMagnet("https://1337x.to/torrent/1234567/Cyberpunk-2077-v2-12/");
console.log(magnet);
// "magnet:?xt=urn:btih:0123456789abcdef0123456789abcdef01234567..."
```

---

## 🧪 Testing

To run the lightweight Node.js test runner:

```bash
npm run test
# or
node test.js
```

Or test interactively using the built-in Studio web UI!
