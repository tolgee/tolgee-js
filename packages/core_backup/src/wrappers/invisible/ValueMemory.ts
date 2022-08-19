export class ValueMemory {
  private values: string[] = [];

  public valueToNumber(key: string) {
    let index = this.values.indexOf(key);
    if (index === -1) {
      index = this.values.length;
      this.values.push(key);
    }
    return index;
  }

  public numberToValue(num: number) {
    return this.values[num];
  }
}
