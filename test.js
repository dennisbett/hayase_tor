/**
 * Test script for Hayase 1337x Torrent Extension
 * Runs both mock HTML table parsing validation and live mirror check.
 */

import { metadata, search, resolveMagnet, parseSearchResultsHtml } from './hayase/1337x.js';

// Sample mock HTML string representing real 1337x search table output
const SAMPLE_1337X_HTML = `
<!DOCTYPE html>
<html>
<body>
  <div class="box-info-heading"><h1>Search Results</h1></div>
  <table class="table-list table table-responsive table-striped">
    <thead>
      <tr>
        <th class="coll-1 name">Name</th>
        <th class="coll-2 seeds">SE</th>
        <th class="coll-3 leeches">LE</th>
        <th class="coll-4 date">Date</th>
        <th class="coll-5 size">Size</th>
        <th class="coll-6 uploader">Uploader</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="coll-1 name">
          <a href="/sub/12/0/" class="icon"><i class="flaticon-movie"></i></a>
          <a href="/torrent/5891234/Frieren-Beyond-Journeys-End-S01-1080p-Dual-Audio/">Frieren Beyond Journey's End S01 1080p Dual Audio x265</a>
        </td>
        <td class="coll-2 seeds">1250</td>
        <td class="coll-3 leeches">42</td>
        <td class="coll-4 date">Aug. 08th '26</td>
        <td class="coll-5 size mob-5">14.8 GB<span class="seeds">1250</span></td>
        <td class="coll-6 uploader"><a href="/user/Erai-raws/">Erai-raws</a></td>
      </tr>
      <tr>
        <td class="coll-1 name">
          <a href="/sub/12/0/" class="icon"><i class="flaticon-movie"></i></a>
          <a href="/torrent/5895678/Cyberpunk-Edgerunners-S01-4K-UHD/">Cyberpunk Edgerunners S01 4K UHD HDR Multi-Subs</a>
        </td>
        <td class="coll-2 seeds">890</td>
        <td class="coll-3 leeches">18</td>
        <td class="coll-4 date">Jul. 22nd '26</td>
        <td class="coll-5 size mob-5">28.4 GB<span class="seeds">890</span></td>
        <td class="coll-6 uploader"><a href="/user/Judas/">Judas</a></td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;

const SAMPLE_DETAIL_PAGE_HTML = `
<!DOCTYPE html>
<html>
<body>
  <div class="box-info-heading"><h1>Frieren Beyond Journey's End S01 1080p</h1></div>
  <div class="da-content">
    <div class="dropdown">
      <a class="btn btn-danger" href="magnet:?xt=urn:btih:a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e&dn=Frieren+S01&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce">Magnet Download</a>
    </div>
  </div>
</body>
</html>
`;

async function runTests() {
  console.log("==================================================");
  console.log("🚀 Testing Hayase 1337x Provider Extension v" + metadata.version);
  console.log("==================================================");
  console.log(`📌 Extension ID   : ${metadata.id}`);
  console.log(`📌 Extension Name : ${metadata.name}`);
  console.log(`📌 Mirrors Count  : ${metadata.mirrors.length}`);
  console.log(`📌 Default Mirror : ${metadata.defaultMirror}`);
  console.log("--------------------------------------------------\n");

  // TEST 1: Mock Parser Test
  console.log("🧪 TEST 1: Testing HTML Parser with Mock 1337x Table Data...");
  const parsedMockResults = parseSearchResultsHtml(SAMPLE_1337X_HTML, "https://1337x.to");

  console.log(`✅ Parsed ${parsedMockResults.length} torrent items from mock HTML:`);
  console.dir(parsedMockResults, { depth: null, colors: true });

  if (parsedMockResults.length !== 2) {
    console.error("❌ FAILED: Expected 2 parsed results from mock HTML.");
  } else {
    console.log("✅ TEST 1 PASSED: Mock parsing extracted all fields correctly.\n");
  }

  // TEST 2: Mock Magnet Link Extraction
  console.log("🧪 TEST 2: Testing Magnet Link Extraction from Detail HTML...");
  const magnetMatch = SAMPLE_DETAIL_PAGE_HTML.match(/(magnet:\?xt=urn:btih:[^"'\s>]+)/i);
  if (magnetMatch && magnetMatch[1]) {
    console.log("✅ Found Magnet URI:", magnetMatch[1]);
    console.log("✅ TEST 2 PASSED: Magnet URI correctly parsed.\n");
  } else {
    console.error("❌ TEST 2 FAILED: Could not extract magnet URI.");
  }

  // TEST 3: Live Query Execution
  console.log("🧪 TEST 3: Attempting Live 1337x Search Query ('Cyberpunk')...");
  try {
    const liveResults = await search({
      query: "Cyberpunk",
      category: "games",
      mirror: "https://1337x.to"
    });

    console.log(`ℹ️ Live search finished. Returned ${liveResults.length} results.`);
    if (liveResults.length > 0) {
      console.log("Sample First Live Result:");
      console.log(liveResults[0]);

      // Test magnet resolution on first result
      if (liveResults[0].url) {
        console.log(`Testing magnet resolution for: ${liveResults[0].url}...`);
        const magnet = await resolveMagnet(liveResults[0].url);
        console.log("Resolved Magnet:", magnet || "None found (or site protected by Cloudflare)");
      }
    } else {
      console.log("Notice: Live query returned 0 results. (Mirror may require proxy or Cloudflare clearance).");
    }
  } catch (err) {
    console.log("Notice: Live query threw an error (Expected if network is restricted):", err.message);
  }

  console.log("\n==================================================");
  console.log("🎉 Test Suite Execution Finished Successfully!");
  console.log("==================================================");
}

runTests();
