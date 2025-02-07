import { Defaults, Route, Parameters } from "./types";
import { lowercaseKeys } from "./util/lowercase-keys";
import { mergeDeep } from "./util/merge-deep";

export function merge(
  defaults: Defaults | null,
  route?: Route | Parameters,
  options?: Parameters
) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? { method, url } : { url: method }, options);
  } else {
    options = Object.assign({}, route);
  }

  // lowercase header names before merging with defaults to avoid duplicates
  options.headers = lowercaseKeys(options.headers);

  const mergedOptions = mergeDeep(defaults || {}, options) as Defaults;

  // mediaType.previews arrays are merged, instead of overwritten
  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews
      .filter(preview => !mergedOptions.mediaType.previews.includes(preview))
      .concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(
    (preview: string) => preview.replace(/-preview/, "")
  );

  return mergedOptions;
}
