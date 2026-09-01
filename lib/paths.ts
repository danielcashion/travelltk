export function tripPath(creatorHandle: string, tripSlug: string): string {
  return `/explore/${creatorHandle}/trips/${tripSlug}`;
}

export function creatorPath(handle: string): string {
  return `/creators/${handle.toLowerCase()}`;
}

export function destinationPath(destination: string): string {
  return `/destinations/${encodeURIComponent(destination.toLowerCase())}`;
}

export function categoryPath(category: string): string {
  return `/categories/${category}`;
}
