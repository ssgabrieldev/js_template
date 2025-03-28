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
    const placeholderClone = new PPTXLoopPlaceholder({
      parent: this.getParent(),
      key: this.getKey(),
      node: this.getOriginalNode(),
      clonedFrom: this
    });

    const originalCloseNode = this.getOriginalCloseNode();
    if (originalCloseNode) {
      placeholderClone.setCloseNode(originalCloseNode);
    }

    let child = this.getFirstChild();

    while (child) {
      if (!child.getClonedFrom()) {
        const childClone = child.clone();

        const childCloseNode = child.getOriginalCloseNode();
        if (childCloseNode) {
          childClone.setCloseNode(childCloseNode);
        }

        placeholderClone.appendChild(childClone);
      }

      child = child.getNext();
    }

    return placeholderClone;
  }
}
