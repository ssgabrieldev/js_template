import { DOMParser } from "xmldom";

import { PPTXTextPlaceholder } from "../PPTXTextPlaceholder";
import { PPTXPlaceholderBuilder } from ".";

describe("PPTXPlaceholder", () => {
  it("should return PPTXTextPlaceholder instance", () => {
    const placeholder = PPTXPlaceholderBuilder.new({
      key: "{foo}",
      node: new DOMParser().parseFromString("")
    });

    expect(placeholder).toBeInstanceOf(PPTXTextPlaceholder);
  });
});

