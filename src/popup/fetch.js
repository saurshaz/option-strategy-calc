const throwCORSError = (url) => {
  return Promise.reject(new Error(
    [
      'Embedded Dark Reader cannot access a cross-origin resource',
      url,
      'Overview your URLs and CORS policies or use',
      '`DarkReader.setFetchMethod(fetch: (url) => Promise<Response>))`.',
      'See if using `DarkReader.setFetchMethod(window.fetch)`',
      'before `DarkReader.enable()` works.'
    ].join(' '),
  ));
};


let fetcher = throwCORSError;

export function setFetchMethod(fetch) {
  if (fetch) {
    fetcher = fetch;
  } else {
    fetcher = throwCORSError;
  }
}

export function callFetchMethod(url) {
  return fetcher(url);
}