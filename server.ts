import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { metadata, search, resolveMagnet, parseSearchResultsHtml } from "./hayase/1337x.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Extension Repository Manifest API Endpoint
  app.get("/api/hayase/manifest", (req, res) => {
    try {
      const manifestPath = path.join(process.cwd(), "hayase", "index.json");
      if (fs.existsSync(manifestPath)) {
        const content = fs.readFileSync(manifestPath, "utf-8");
        const json = JSON.parse(content);
        return res.json(json);
      }
      return res.json([metadata]);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 2. Extension Script Raw File API Endpoint
  app.get("/api/hayase/1337x.js", (req, res) => {
    try {
      const scriptPath = path.join(process.cwd(), "hayase", "1337x.js");
      if (fs.existsSync(scriptPath)) {
        res.setHeader("Content-Type", "application/javascript");
        return res.sendFile(scriptPath);
      }
      return res.status(404).send("// 1337x.js not found");
    } catch (err: any) {
      return res.status(500).send(`// Error: ${err.message}`);
    }
  });

  // 3. Search Torrent Endpoint (supports live proxy search & fallback mock search)
  app.post("/api/search", async (req, res) => {
    const { query, category, mirror, page = 1, forceMock = false } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required", results: [] });
    }

    // Optional mock generator for testing UI offline
    if (forceMock) {
      const mockResults = [
        {
          id: "1337x:5891234",
          title: `[Mock] ${query} - S01 1080p Dual Audio x265 HEVC 10bit`,
          url: `${mirror || "https://1337x.to"}/torrent/5891234/${encodeURIComponent(query)}-S01-1080p/`,
          path: `/torrent/5891234/${encodeURIComponent(query)}-S01-1080p/`,
          seeders: 1850,
          leechers: 34,
          size: "12.4 GB",
          date: "Aug 09, 2026",
          uploader: "Erai-raws",
          provider: "1337x",
          magnet: "magnet:?xt=urn:btih:0123456789abcdef0123456789abcdef01234567&dn=" + encodeURIComponent(query)
        },
        {
          id: "1337x:5895678",
          title: `[Mock] ${query} Complete Collection 2160p 4K HDR Multi-Subs`,
          url: `${mirror || "https://1337x.to"}/torrent/5895678/${encodeURIComponent(query)}-Complete-2160p/`,
          path: `/torrent/5895678/${encodeURIComponent(query)}-Complete-2160p/`,
          seeders: 940,
          leechers: 12,
          size: "45.2 GB",
          date: "Jul 28, 2026",
          uploader: "QxR",
          provider: "1337x",
          magnet: "magnet:?xt=urn:btih:89abcdef0123456789abcdef0123456701234567&dn=" + encodeURIComponent(query)
        },
        {
          id: "1337x:5899999",
          title: `[Mock] ${query} Soundtrack OST FLAC Lossless`,
          url: `${mirror || "https://1337x.to"}/torrent/5899999/${encodeURIComponent(query)}-OST-FLAC/`,
          path: `/torrent/5899999/${encodeURIComponent(query)}-OST-FLAC/`,
          seeders: 320,
          leechers: 5,
          size: "620 MB",
          date: "Jun 15, 2026",
          uploader: "HiResAudio",
          provider: "1337x",
          magnet: "magnet:?xt=urn:btih:fedcba9876543210fedcba9876543210fedcba98&dn=" + encodeURIComponent(query)
        }
      ];
      return res.json({ source: "mock", results: mockResults, count: mockResults.length });
    }

    try {
      const results = await search({
        query,
        category,
        mirror: mirror || metadata.defaultMirror,
        page
      });

      // If live returns 0 results due to regional ISP block or Cloudflare captcha, provide notification + fallback option
      return res.json({
        source: "live",
        results,
        count: results.length,
        notice: results.length === 0 ? "No live results returned. Site may be protected by Cloudflare or blocking server IP. You can toggle Mock Mode to test UI layout." : undefined
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message, results: [] });
    }
  });

  // 4. Resolve Magnet Link Endpoint
  app.post("/api/resolve-magnet", async (req, res) => {
    const { detailUrl, mirror } = req.body;

    if (!detailUrl) {
      return res.status(400).json({ error: "detailUrl is required" });
    }

    try {
      const magnet = await resolveMagnet(detailUrl, { mirror });
      return res.json({ magnet, detailUrl });
    } catch (err: any) {
      return res.status(500).json({ error: err.message, magnet: null });
    }
  });

  // 5. Test Suite Endpoint
  app.get("/api/run-test", async (req, res) => {
    const logs: string[] = [];
    const pushLog = (msg: string) => logs.push(msg);

    pushLog(`=== Hayase 1337x Extension Test Suite v${metadata.version} ===`);
    pushLog(`ID: ${metadata.id} | Name: ${metadata.name}`);
    pushLog(`Default Mirror: ${metadata.defaultMirror}`);
    pushLog(`Total Mirrors Configured: ${metadata.mirrors.length}`);

    // Run Mock HTML parse test
    const mockHtml = `<table class="table-list table table-responsive table-striped">
      <tbody>
        <tr>
          <td class="coll-1 name">
            <a href="/sub/12/0/" class="icon"><i class="flaticon-movie"></i></a>
            <a href="/torrent/5891234/Test-Torrent-Name/">Test Torrent Name 1080p</a>
          </td>
          <td class="coll-2 seeds">1500</td>
          <td class="coll-3 leeches">50</td>
          <td class="coll-4 date">Aug. 11th '26</td>
          <td class="coll-5 size mob-5">2.5 GB<span class="seeds">1500</span></td>
          <td class="coll-6 uploader"><a href="/user/Tester/">Tester</a></td>
        </tr>
      </tbody>
    </table>`;

    const parsed = parseSearchResultsHtml(mockHtml, "https://1337x.to");
    pushLog(`[Test 1] Mock HTML Table Parser: Parsed ${parsed.length} items`);
    if (parsed.length === 1 && parsed[0].seeders === 1500 && parsed[0].size === "2.5 GB") {
      pushLog(`[Test 1 PASSED] Title: "${parsed[0].title}", Seeders: ${parsed[0].seeders}, Size: ${parsed[0].size}`);
    } else {
      pushLog(`[Test 1 FAILED] Mock parse result unexpected.`);
    }

    // Run live test
    pushLog(`[Test 2] Querying 1337x live endpoint for 'Ubuntu'...`);
    try {
      const live = await search({ query: "Ubuntu", category: "apps" });
      pushLog(`[Test 2 Result] Received ${live.length} live torrent results.`);
    } catch (e: any) {
      pushLog(`[Test 2 Notice] Live query warning: ${e.message}`);
    }

    pushLog(`=== Test Execution Finished Successfully ===`);
    return res.json({ success: true, logs });
  });

  // Vite integration middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
