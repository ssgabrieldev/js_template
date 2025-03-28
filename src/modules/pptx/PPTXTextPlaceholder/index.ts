import { Placeholder, TPlaceholderContructor } from "../../../contracts/Placeholder";

export class PPTXTextPlaceholder extends Placeholder {
  constructor(data: TPlaceholderContructor) {
    super(data);
  }

  public getOpenTag(): string {
      return `{${this.getKey()}}`;
  }

  public getCloseTag(): string {
      return `{${this.getKey()}}`;
  }

  public populate(data: string): void {
    const textElements = this.node.getElementsByTagName("a:t");
    const openTag = this.getOpenTag();
    
    for (let i = 0; i < textElements.length; i++) {
      const textElement = textElements[i];
      const textContent = textElement.textContent;
      if (textContent && textContent.includes(openTag)) {
        textElement.textContent = textContent.replace(openTag, data);
      }
    }
  }

  public clone(): PPTXTextPlaceholder {
    const placeholderClone = new PPTXTextPlaceholder({
      parent: this.getParent(),
      key: this.getKey(),
      node: this.getOriginalNode(),
      clonedFrom: this
    });

    return placeholderClone;
  }
}
