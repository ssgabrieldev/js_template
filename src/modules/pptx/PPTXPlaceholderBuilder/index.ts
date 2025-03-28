import { Placeholder, TPlaceholderContructor } from "../../../contracts/Placeholder";
import { PPTXLoopPlaceholder } from "../PPTXLoopPlaceholder";
import { PPTXTextPlaceholder } from "../PPTXTextPlaceholder";

export class PPTXPlaceholderBuilder {
  public static getKeyToTextPlaceholder(key: string): string {
    return key.replace(/^{/, "").replace(/}$/, "");
  }

  public static getKeyToLoopPlaceholder(key: string): string {
    return key.replace(/^{#/, "").replace(/}$/, "");
  }

  public static new(params: TPlaceholderContructor): Placeholder | false {
    const { key, node, parent } = params;

    if (key.match(/^{#/)) {
      return new PPTXLoopPlaceholder({
        key: PPTXPlaceholderBuilder.getKeyToLoopPlaceholder(key),
        node,
        parent
      });
    }

    if (key.match(/^{\//)) {
      return false;
    }

    return new PPTXTextPlaceholder({
      key: PPTXPlaceholderBuilder.getKeyToTextPlaceholder(key),
      node,
      parent
    });
  }
}
