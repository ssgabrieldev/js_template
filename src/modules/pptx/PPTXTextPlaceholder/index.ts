import { PPTXPlaceholder, TPlaceholderContructor } from "../PPTXPlaceholder";

export class PPTXTextPlaceholder extends PPTXPlaceholder {
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
    const textElements = this.getNode().getElementsByTagName("a:t");
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
    const parent = this.getParent();

    let node = this.getOriginalNode();

    if (parent && parent.getNode() == this.getNode()) {
      node = this.getNode();
    }

    const placeholderClone = new PPTXTextPlaceholder({
      parent: this.getParent(),
      key: this.getKey(),
      node,
      clonedFrom: this
    });

    return placeholderClone;
  }
}
