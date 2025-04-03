export type TPlaceholderContructor = {
  key: string;
  node: Element;
  parent: PPTXPlaceholder | null;
  clonedFrom?: PPTXPlaceholder;
}

export abstract class PPTXPlaceholder {
  protected key: string;
  protected node: Element;
  protected originalNode: Element;

  protected clonedFrom?: PPTXPlaceholder;

  protected closeNode: Element | null = null;
  protected originalCloseNode: Element | null = null;
  protected parent: PPTXPlaceholder | null = null;
  protected firstChild: PPTXPlaceholder | null = null;
  protected lastChild: PPTXPlaceholder | null = null;
  protected next: PPTXPlaceholder | null = null;
  protected prev: PPTXPlaceholder | null = null;

  public abstract populate(data: any): void;
  public abstract clone(): PPTXPlaceholder;
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

  public getParent(): PPTXPlaceholder | null {
    return this.parent;
  }

  public getFirstChild(): PPTXPlaceholder | null {
    return this.firstChild;
  }

  public getLastChild(): PPTXPlaceholder | null {
    return this.lastChild;
  }

  public getPrev(): PPTXPlaceholder | null {
    return this.prev;
  }

  public getNext(): PPTXPlaceholder | null {
    return this.next;
  }

  public getClonedFrom(): PPTXPlaceholder | undefined {
    return this.clonedFrom;
  }

  public setCloseNode(node: Element): void {
    this.closeNode = node;
    this.originalCloseNode = node.cloneNode(true) as Element;
  }

  public setPrev(placeholder: PPTXPlaceholder | null): void {
    this.prev = placeholder;
  }

  public setNext(placeholder: PPTXPlaceholder | null): void {
    this.next = placeholder;
  }

  public setParent(placeholder: PPTXPlaceholder): void {
    this.parent = placeholder;
  }

  public getOriginalOpenTagLineNode(): Element | undefined {
    const node = this.getOriginalNode();

    const lineNodes = node.getElementsByTagName("a:r");

    for (let i = 0; i < lineNodes.length; i++) {
      const lineNode = lineNodes[i];

      if (lineNode.textContent && lineNode.textContent.match(this.getOpenTag())) {
        return lineNode;
      }
    }
  }

  public getOriginalCloseTagLineNode(): Element | undefined {
    const node = this.getOriginalCloseNode();

    if (!node) {
      return;
    }

    const lineNodes = node.getElementsByTagName("a:r");

    for (let i = 0; i < lineNodes.length; i++) {
      const lineNode = lineNodes[i];

      if (lineNode.textContent && lineNode.textContent.match(this.getCloseTag())) {
        return lineNode;
      }
    }
  }

  public getOpenTagLineNode(): Element | undefined {
    const node = this.getNode();

    const lineNodes = node.getElementsByTagName("a:r");

    for (let i = 0; i < lineNodes.length; i++) {
      const lineNode = lineNodes[i];

      if (lineNode.textContent && lineNode.textContent.match(this.getOpenTag())) {
        return lineNode;
      }
    }
  }

  public getCloseTagLineNode(): Element | undefined {
    const node = this.getCloseNode();

    if (!node) {
      return;
    }

    const lineNodes = node.getElementsByTagName("a:r");

    for (let i = 0; i < lineNodes.length; i++) {
      const lineNode = lineNodes[i];

      if (lineNode.textContent && lineNode.textContent.match(this.getCloseTag())) {
        return lineNode;
      }
    }
  }

  public appendNodeFromPlaceholder(placeholder: PPTXPlaceholder): void {
    const openTag = this.getOpenTag();
    const closeTag = this.getCloseTag();
    const closeNode = this.getCloseNode();
    const node = this.getNode();
    const originalNode = this.getOriginalNode();

    if (closeNode == node) {
      const closeTagLineNode = this.getCloseTagLineNode();
      const openTagLineNode = this.getOpenTagLineNode();

      if (openTagLineNode && closeTagLineNode == openTagLineNode) {
        const textNodes = openTagLineNode.getElementsByTagName("a:t");
        const hasOnlyOneTextNode = textNodes.length == 1;

        if (hasOnlyOneTextNode) {
          const textNode = textNodes[0];
          const textContent = originalNode.textContent;

          if (textContent) {
            const [content] = textContent.match(new RegExp(`${openTag}.*${closeTag}`)) || [];

            if (content && textNode.textContent) {
              const finalContent = content.replace(openTag, "").replace(closeTag, "");

              textNode.textContent = textNode.textContent.replace(closeTag, `${finalContent}${closeTag}`);
            }
          }
        }
      } else {
        const originalOpenTagLineNode = this.getOriginalOpenTagLineNode();
        const nodesToClone = [originalOpenTagLineNode];

        let originalCloseTagLineNode = null;

        if (this.getCloseNode() && originalOpenTagLineNode) {
          for (
            let nextNode = originalOpenTagLineNode.nextSibling;
            !!nextNode;
            nextNode = nextNode.nextSibling
          ) {
            nodesToClone.unshift(nextNode as Element);
            if (nextNode.textContent && nextNode.textContent.match(closeTag)) {
              originalCloseTagLineNode = nextNode;
              break;
            }
          }
        }

        nodesToClone.forEach((nodeToClone) => {
          if (!nodeToClone) {
            return;
          }

          if (nodeToClone == originalOpenTagLineNode) {
            const textNode = nodeToClone.getElementsByTagName("a:t")[0];
            const textContent = textNode.textContent;

            if (textContent) {
              const [finalContent] = textContent.match(new RegExp(`${openTag}.*`)) || [];

              if (finalContent) {
                textNode.textContent = finalContent.replace(openTag, "");
              }
            }
          }

          if (nodeToClone == originalCloseTagLineNode && closeTagLineNode) {
            const textNode = closeTagLineNode.getElementsByTagName("a:t")[0];
            const textContent = textNode.textContent;

            if (textContent) {
              const [finalContent] = textContent.match(new RegExp(`.*${closeTag}`)) || [];

              if (finalContent) {
                textNode.textContent = finalContent.replace(closeTag, "");
              }
            }
          }

          if (closeTagLineNode && closeTagLineNode.parentNode && closeTagLineNode.nextSibling) {
            closeTagLineNode.parentNode.insertBefore(nodeToClone, closeTagLineNode.nextSibling);
          } else if (closeTagLineNode && closeTagLineNode.parentNode && !closeTagLineNode.nextSibling) {
            closeTagLineNode.parentNode.appendChild(nodeToClone);
          }
        });
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

  public appendChild(placeholder: PPTXPlaceholder, appendNode?: boolean): void {
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

  public removeTags() {
    const openNode = this.getNode();
    const closeNode = this.getCloseNode();

    const openNodeTextNodes = openNode.getElementsByTagName("a:t");

    for (let i = 0; i < openNodeTextNodes.length; i++) {
      const textNode = openNodeTextNodes[i];
      const textContent = textNode.textContent;

      if (textContent) {
        textNode.textContent = textContent.replaceAll(this.getOpenTag(), "");
      }
    }

    if (closeNode) {
      const closeNodeTextNodes = closeNode.getElementsByTagName("a:t");

      for (let i = 0; i < closeNodeTextNodes.length; i++) {
        const textNode = closeNodeTextNodes[i];
        const textContent = textNode.textContent;

        if (textContent) {
          textNode.textContent = textContent.replaceAll(this.getCloseTag(), "");
        }
      }
    }
  }
}
