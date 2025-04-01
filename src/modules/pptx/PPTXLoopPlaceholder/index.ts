import { Placeholder, TPlaceholderContructor } from "../../../contracts/Placeholder";

export class PPTXLoopPlaceholder extends Placeholder {
  constructor(data: TPlaceholderContructor) {
    super(data);
  }

  public getOpenTag(): string {
    return `{#${this.getKey()}}`;
  }

  public getCloseTag(): string {
    return `{/${this.getKey()}}`;
  }

  public populate(data: any): void {
    if (Array.isArray(data)) {

      data.forEach((d, dataIndex) => {
        let child = this.getFirstChild();

        while (child) {
          if (dataIndex == 0) {
            child.populate(d);

            child = child.getNext();

            continue;
          }

          if (dataIndex != 0) {
            const childClonedFrom = child.getClonedFrom();
            const clonedFrom = this.getClonedFrom();

            if (childClonedFrom && !clonedFrom) {
              break;
            }

            if (!childClonedFrom && !clonedFrom) {
              const childClone = child.clone();

              this.appendChild(childClone, true);

              childClone.populate(d);

              child = child.getNext();

              continue;
            }

            if (childClonedFrom) {
              const childClone = childClonedFrom.clone();

              this.appendChild(childClone, true);

              childClone.populate(d);

              const nextOriginalChild = childClonedFrom.getNext();
              if (nextOriginalChild && nextOriginalChild.getClonedFrom()) {
                break;
              }

              child = child.getNext();
            }
          }

          break;
        }
      });
    }
  }

  clone(): PPTXLoopPlaceholder {
    const parent = this.getParent();
    const shoulCreateNewNodes = parent
      && parent.getNode() != parent.getCloseNode();

    let node = this.getOriginalNode();

    if (!shoulCreateNewNodes) {
      node = this.getNode();
    }

    const placeholderClone = new PPTXLoopPlaceholder({
      node,
      parent: this.getParent(),
      key: this.getKey(),
      clonedFrom: this
    });

    const originalCloseNode = this.getOriginalCloseNode();
    if (originalCloseNode && shoulCreateNewNodes) {
      placeholderClone.setCloseNode(originalCloseNode);
    }

    const closeNode = this.getCloseNode();
    if (closeNode && !shoulCreateNewNodes) {
      placeholderClone.setCloseNode(closeNode);
    }

    let child = this.getFirstChild();

    while (child) {
      if (!child.getClonedFrom()) {
        const childClone = child.clone();

        placeholderClone.appendChild(childClone);
      }

      child = child.getNext();
    }

    return placeholderClone;
  }
}
