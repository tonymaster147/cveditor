/**
 * Path-based setter for nested data.
 * path: array like ["experience", 0, "title"]
 */
export function setPath(obj, path, value) {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const next = obj.slice();
    next[head] = setPath(obj[head], rest, value);
    return next;
  }
  return { ...obj, [head]: setPath(obj?.[head], rest, value) };
}

/**
 * Returns helpers bound to a top-level array key.
 * addBlock pushes a new item, removeBlock removes by index.
 */
export function listOps(data, update, key, factory) {
  return {
    add: () => update([key], [...(data[key] || []), factory()]),
    remove: (i) => update([key], (data[key] || []).filter((_, idx) => idx !== i)),
  };
}
