export function filterDuplicates(items: string[]): string[] {
  const sortedItems = [...items].sort();
  const duplicates: string[] = [];
  let lastItem: string | undefined = undefined;
  for (const item of sortedItems) {
    if (item === lastItem) {
      duplicates.push(item);
    }
    lastItem = item;
  }
  return duplicates;
}
