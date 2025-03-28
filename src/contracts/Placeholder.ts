export type TPlaceholderContructor = {
  key: string;
  node: Element;
  parent: Placeholder | null;
  clonedFrom?: Placeholder;
}

export abstract class Placeholder {
  protected key: string;
  protected node: Element;

  protected closeNode: Element | null = null;
  protected originalNode: Element;
  protected originalCloseNode: Element | null = null;
  protected parent: Placeholder | null = null;
  protected firstChild: Placeholder | null = null;
  protected lastChild: Placeholder | null = null;
  protected next: Placeholder | null = null;
  protected prev: Placeholder | null = null;
  protected clonedFrom?: Placeholder;

  public abstract populate(data: any): void;
  public abstract clone(): Placeholder;
  public abstract getOpenTag(): string;
  public abstract getCloseTag(): string;

  constructor({ key, node, parent, clonedFrom }: TPlaceholderContructor) {
    this.key = key;
    this.node = node;
    this.originalNode = node.cloneNode(true) as Element;
    this.parent = parent;
    this.clonedFrom = clonedFrom;
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
    if (this.closeNode?.parentNode) {
      this.closeNode.parentNode.insertBefore(placeholder.getNode(), this.closeNode);
    
      const placeholderCloseNode = placeholder.getCloseNode();
      if (placeholderCloseNode) {
        this.closeNode.parentNode.insertBefore(placeholderCloseNode, this.closeNode);
      }
    
      let child = placeholder.getFirstChild();
      while (child) {
        placeholder.appendNodeFromPlaceholder(child);
    
        child = child.getNext();
      }
    }
  }

  public appendChild(placeholder: Placeholder, appendNode?: boolean): void {
    if (appendNode) {
      this.appendNodeFromPlaceholder(placeholder);
    }

    if (this.firstChild == null) {
      this.firstChild = placeholder;
      this.lastChild = placeholder;

      return;
    }

    if (this.lastChild) {
      placeholder.setPrev(this.lastChild);
      this.lastChild.next = placeholder;
    }

    placeholder.setParent(this);
    this.lastChild = placeholder;
  }
}
