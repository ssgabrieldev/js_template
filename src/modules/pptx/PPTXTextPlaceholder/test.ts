import { DOMParser, XMLSerializer } from "xmldom";

import { PPTXTextPlaceholder } from ".";

describe("PPTXPlaceholder", () => {
  const serializer = new XMLSerializer();
  const parser = new DOMParser();

  it("should populate replace placeholder", () => {
    const expectedOutputXML = parser.parseFromString(`
      <a:p>
        <a:r>
          <a:t>foo</a:t>
        </a:r>
      </a:p>
    `);
    const node = parser.parseFromString(`
      <a:p>
        <a:r>
          <a:t>{item}</a:t>
        </a:r>
      </a:p>
    `).getElementsByTagName("a:p")[0];

    const value = "foo";
    const key = "item";
    const pptxPlaceholder = new PPTXTextPlaceholder({ key, node, parent: null });

    pptxPlaceholder.populate(value);

    const parentNodeXMLString = serializer.serializeToString(node);
    const expectedOutputXMLString = serializer.serializeToString(expectedOutputXML);

    expect(parentNodeXMLString.replace(/\s+/g, ""))
      .toBe(expectedOutputXMLString.replace(/\s+/g, ""));
  });
});
