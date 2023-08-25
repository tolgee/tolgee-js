export const MAX_FILE_COUNT = 20;

export const dataTransferItemsToArray = (
  items: DataTransferItemList
): File[] => {
  const result = [] as any[];
  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === 'file') {
      result.push(items[i].getAsFile());
    }
  }
  return result;
};
