const parseCurl = (input: string) => {
  let s = '';
  let i = 0;
  while (i < input.length) {
    if (input[i] === '^' && i + 1 < input.length) {
      s += input[i + 1];
      i += 2;
    } else {
      s += input[i];
      i++;
    }
  }

  const q = `(?:'([^']*)'|"([^"]*)")`;

  const cookieMatch = s.match(new RegExp(`(?:-b|--cookie)\\s+\\$?${q}`));
  const rawCookieStr = cookieMatch?.[1] ?? cookieMatch?.[2] ?? null;
  const cookie = rawCookieStr
    ? rawCookieStr
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/\\_/g, '_')
        .replace(/(^|;\s*)\*\*([a-zA-Z])/g, '$1__$2')
    : null;

  const xsrfMatch = s.match(
    new RegExp(`-H\\s+(?:'x-xsrftoken:\\s*([^']*)'|"x-xsrftoken:\\s*([^"]*)")`, 'i'),
  );
  const xsrfFromHeader = (xsrfMatch?.[1] ?? xsrfMatch?.[2])?.trim() ?? null;
  const xsrfFromCookie =
    cookieMatch?.[1]?.match(/_xsrf=([^;]+)/)?.[1] ??
    cookieMatch?.[2]?.match(/_xsrf=([^;]+)/)?.[1] ??
    null;
  const xsrfToken = xsrfFromHeader ?? xsrfFromCookie;

  const versionMatch = s.match(
    new RegExp(`-H\\s+(?:'x-static-version:\\s*([^']*)'|"x-static-version:\\s*([^"]*)")`, 'i'),
  );
  const versionFromHeader = (versionMatch?.[1] ?? versionMatch?.[2])?.trim() ?? null;
  const versionFromBaggage = s.match(/sentry-release=xhh(?:%40|@)([0-9.]+)/i)?.[1] ?? null;
  const staticVersion = versionFromHeader ?? versionFromBaggage;

  const urlMatch = s.match(/curl\s+['"]?(https?:\/\/[^/?#'"\s]+)/i);
  const baseUrl = urlMatch ? new URL(urlMatch[1]).origin : null;

  return { cookie, xsrfToken, staticVersion, baseUrl };
};

export { parseCurl };
