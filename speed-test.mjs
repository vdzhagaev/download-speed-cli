const ATTEMPTS = 10;
const TIMEOUT_MS = 30_000;

let url;
try {
  if (process.argv.length !== 3) {
    throw new Error('Exactly one URL is required');
  }
  url = new URL(process.argv[2]);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS are supported');
  }
} catch {
  console.error('Provide a valid HTTP or HTTPS URL.');
  console.error('Example: node speed-test.mjs https://example.com/file.bin');
  process.exit(1);
}

async function measure(url) {
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  let status;

  try {
    const start = performance.now();
    const response = await fetch(url, { signal });
    status = response.status;
    let bytes = 0;

    if (response.body) {
      for await (const chunk of response.body) {
        bytes += chunk.byteLength;
      }
    }
    const elapsedMs = performance.now() - start;

    if (!response.ok) {
      throw new Error(`HTTP error: ${status} ${response.statusText}`);
    }

    return { ok: true, status, bytes, elapsedMs };
  } catch (error) {
    const reason = signal.aborted
      ? `Timeout after ${TIMEOUT_MS / 1000} s`
      : error.message;
    return { ok: false, status, reason };
  }
}

function speed(bytes, elapsedMs) {
  return (bytes / 1_000_000) / (elapsedMs / 1000);
}

let successful = 0;
let totalBytes = 0;
let totalMs = 0;

console.log(`URL: ${url.href}`);

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  const result = await measure(url);

  if (!result.ok) {
    console.log(`${attempt}/${ATTEMPTS} | HTTP ${result.status ?? '—'} | Error: ${result.reason}`);
    continue;
  }

  successful++;
  totalBytes += result.bytes;
  totalMs += result.elapsedMs;

  console.log(
    `${attempt}/${ATTEMPTS} | HTTP ${result.status}` +
    ` | ${result.elapsedMs.toFixed(2)} ms | ${result.bytes} bytes` +
    ` | ${speed(result.bytes, result.elapsedMs).toFixed(3)} MB/s`,
  );
}

console.log(`\nSuccessful attempts: ${successful}/${ATTEMPTS}`);

if (successful === 0) {
  console.log('No successful measurements.');
  process.exitCode = 1;
} else {
  console.log(`Average time: ${(totalMs / successful).toFixed(2)} ms`);
  console.log(`Total downloaded: ${totalBytes} bytes (${(totalBytes / 1_000_000).toFixed(3)} MB)`);
  console.log(`Overall speed: ${speed(totalBytes, totalMs).toFixed(3)} MB/s`);
}
