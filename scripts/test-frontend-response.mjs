async function test() {
  try {
    const res = await fetch('http://localhost:3000/');
    console.log('GET / Status:', res.status);
    const html = await res.text();
    console.log('HTML length:', html.length);

    // Look for link rel="stylesheet"
    const cssMatches = [...html.matchAll(/href="(\/_next\/static\/css\/[^"]+)"/g)];
    console.log('CSS links found:', cssMatches.map(m => m[1]));

    if (cssMatches.length === 0) {
      console.warn('⚠️ WARNING: NO CSS LINKS FOUND IN HTML!');
      // Check head content
      const head = html.match(/<head>([\s\S]*?)<\/head>/i);
      console.log('Head content preview:', head ? head[1].slice(0, 500) : 'No head');
    }

    for (const match of cssMatches) {
      const cssUrl = 'http://localhost:3000' + match[1];
      const cssRes = await fetch(cssUrl);
      const cssContent = await cssRes.text();
      console.log(match[1], 'Status:', cssRes.status, 'Size:', cssContent.length);
      console.log('CSS Preview:', cssContent.slice(0, 150));
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

test();
