export function filterDuplicates(items: string[]): string[] {
  const sortedItems = items.slice(0).sort();
  const duplicates: string[] = [];
  let lastItem: string | null = null;
  sortedItems.forEach((item: string) => {
    if (duplicates.includes(item)) {
      return;
    }
    if (item === lastItem) {
      duplicates.push(item);
    }
    lastItem = item;
  });
  return duplicates;
}
