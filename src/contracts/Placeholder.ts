import { argv0 } from "process";

export type TPlaceholderContructor = {
  key: string;
  node: Element;
  parent: Placeholder | null;
  clonedFrom?: Placeholder;
}

export abstract class Placeholder {
  protected key: string;
  protected node: Element;
  protected originalNode: Element;

  protected clonedFrom?: Placeholder;

  protected closeNode: Element | null = null;
  protected originalCloseNode: Element | null = null;
  protected parent: Placeholder | null = null;
  protected firstChild: Placeholder | null = null;
  protected lastChild: Placeholder | null = null;
  protected next: Placeholder | null = null;
  protected prev: Placeholder | null = null;

  public abstract populate(data: any): void;
  public abstract clone(): Placeholder;
  public abstract getOpenTag(): string;
  public abstract getCloseTag(): string;

  constructor({ key, node, parent, clonedFrom }: TPlaceholderContructor) {
    this.key = key;
    this.node = node;
    this.parent = parent;
    this.clonedFrom = clonedFrom;

    if (clonedFrom) {
      this.originalNode = clonedFrom.getOriginalNode().cloneNode(true) as Element;
    } else {
      this.originalNode = node.cloneNode(true) as Element;
    }
  }

  public getKey(): string {
    return this.key;
  }

  public getNode(): Element {
    return this.node;
  }

  public getCloseNode(): Element | null {
    return this.closeNode;
  }

  public getOriginalNode(): Element {
    return this.originalNode.cloneNode(true) as Element;
  }

  public getOriginalCloseNode(): Element | null {
    return this.originalCloseNode?.cloneNode(true) as Element | null;
  }

  public getParent(): Placeholder | null {
    return this.parent;
  }

  public getFirstChild(): Placeholder | null {
    return this.firstChild;
  }

  public getLastChild(): Placeholder | null {
    return this.lastChild;
  }

  public getPrev(): Placeholder | null {
    return this.prev;
  }

  public getNext(): Placeholder | null {
    return this.next;
  }

  public getClonedFrom(): Placeholder | undefined {
    return this.clonedFrom;
  }

  public setCloseNode(node: Element): void {
    this.closeNode = node;
    this.originalCloseNode = node.cloneNode(true) as Element;
  }

  public setPrev(placeholder: Placeholder | null): void {
    this.prev = placeholder;
  }

  public setNext(placeholder: Placeholder | null): void {
    this.next = placeholder;
  }

  public setParent(placeholder: Placeholder): void {
    this.parent = placeholder;
  }

  public appendNodeFromPlaceholder(placeholder: Placeholder): void {
    const closeNode = this.getCloseNode();
    const node = this.getNode();

    if (closeNode == node) {
      const placeholderOriginalNode = placeholder.getOriginalNode();

      const originalLines = placeholderOriginalNode.getElementsByTagName("a:r");

      for (let i = 0; i < originalLines.length; i++) {
        const originalLine = originalLines[originalLines.length - 1];
        const lines = node.getElementsByTagName("a:r");
        const lastLine = lines[lines.length - 1];

        if (lastLine.nextSibling) {
          node.insertBefore(originalLine, lastLine);
        } else if (node.parentNode) {
          node.appendChild(originalLine);
        }
      }
    } else if (closeNode && closeNode.parentNode) {
      closeNode.parentNode.insertBefore(placeholder.getNode(), this.closeNode);

      const placeholderCloseNode = placeholder.getCloseNode();
      if (placeholderCloseNode) {
        closeNode.parentNode.insertBefore(placeholderCloseNode, this.closeNode);
      }

      for (let child = placeholder.getFirstChild(); child; child = child.getNext()) {
        placeholder.appendNodeFromPlaceholder(child);
      }
    }
  }

  public appendChild(placeholder: Placeholder, appendNode?: boolean): void {
    const firstChild = this.getFirstChild();
    const lastChild = this.getLastChild();

    if (appendNode) {
      this.appendNodeFromPlaceholder(placeholder);
    }

    if (!firstChild) {
      this.firstChild = placeholder;
      this.lastChild = placeholder;
      placeholder.setParent(this);

      return;
    }

    if (lastChild) {
      placeholder.setPrev(this.lastChild);
      lastChild.next = placeholder;
    }

    placeholder.setParent(this);
    this.lastChild = placeholder;
  }
}
