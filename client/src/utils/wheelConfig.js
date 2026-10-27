
export const DEFAULT_WHEEL_TEXTS = [
  'Add a point',
  'Extra turn',
  'Deduct a point',
  'Steal',
  'Add two points',
  'Wildcard',
  'Deduct two points'
];



export function arrangeWheelEntries(defaultTexts = DEFAULT_WHEEL_TEXTS, customTexts = []) {
  const cleanCustoms = (customTexts || [])
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);

  if (cleanCustoms.length === 0) {
    return [...defaultTexts];
  }

  const result = [];
  const totalDefaults = defaultTexts.length;
  const totalCustoms = cleanCustoms.length;

  let customIdx = 0;
  for (let i = 0; i < totalDefaults; i++) {
    result.push(defaultTexts[i]);

    const remainingCustoms = totalCustoms - customIdx;
    const remainingSlots = totalDefaults - i;
    const itemsForThisSlot = Math.ceil(remainingCustoms / remainingSlots);

    for (let k = 0; k < itemsForThisSlot && customIdx < totalCustoms; k++) {
      result.push(cleanCustoms[customIdx]);
      customIdx++;
    }
  }

  while (customIdx < totalCustoms) {
    result.push(cleanCustoms[customIdx++]);
  }

  return result;
}
