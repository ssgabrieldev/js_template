import { DOMParser, XMLSerializer } from "xmldom";
import { PPTXLoopPlaceholder } from ".";
import { PPTXTextPlaceholder } from "../PPTXTextPlaceholder";

describe("PPTXPlaceholder", () => {
  const serializer = new XMLSerializer();
  const parser = new DOMParser();

  it("should clone children correctly with one level of depth", () => {
    const expectedOutputXML = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>item1</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>item2</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const parentNode = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{item}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const openItemsNode = parentNode.getElementsByTagName("a:p")[0];
    const itemNode = parentNode.getElementsByTagName("a:p")[1];
    const closeItemsNode = parentNode.getElementsByTagName("a:p")[2];
    const itemsPlaceholder = new PPTXLoopPlaceholder({
      key: "items",
      parent: null,
      node: openItemsNode
    });
    const itemPlaceholder = new PPTXTextPlaceholder({
      key: "item",
      parent: itemsPlaceholder,
      node: itemNode
    });

    itemsPlaceholder.setCloseNode(closeItemsNode);
    itemsPlaceholder.appendChild(itemPlaceholder);

    const data = [
      "item1",
      "item2"
    ];

    itemsPlaceholder.populate(data);

    const itemsNodeXMLString = serializer.serializeToString(parentNode)
      .replace(/\s+/g, "");
    const expectedOutputXMLString = serializer.serializeToString(expectedOutputXML)
      .replace(/\s+/g, "");

    expect(expectedOutputXMLString == itemsNodeXMLString).toBe(true);
  });

  it("should clone children correctly with two levels of depth", () => {
    const expectedOutputXML = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{#names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>name1</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>name2</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{#names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>name3</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>name4</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const parentNode = parser.parseFromString(`
      <p:txBody>
        <a:p>
          <a:r>
            <a:t>{#items}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{#names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{name}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/names}</a:t>
          </a:r>
        </a:p>
        <a:p>
          <a:r>
            <a:t>{/items}</a:t>
          </a:r>
        </a:p>
      </p:txBody>
    `);
    const itemsOpenNode = parentNode.getElementsByTagName("a:p")[0];
    const namesOpenNode = parentNode.getElementsByTagName("a:p")[1];
    const lorenNode = parentNode.getElementsByTagName("a:p")[2];
    const namesCloseNode = parentNode.getElementsByTagName("a:p")[3];
    const itemsCloseNode = parentNode.getElementsByTagName("a:p")[4];
    const itemsPlaceholder = new PPTXLoopPlaceholder({
      key: "items",
      parent: null,
      node: itemsOpenNode
    });
    const namesPlaceholder = new PPTXLoopPlaceholder({
      key: "names",
      parent: itemsPlaceholder,
      node: namesOpenNode
    });
    const lorenPlaceholder = new PPTXTextPlaceholder({
      key: "name",
      parent: namesPlaceholder,
      node: lorenNode
    });

    itemsPlaceholder.setCloseNode(itemsCloseNode);
    itemsPlaceholder.appendChild(namesPlaceholder);

    namesPlaceholder.setCloseNode(namesCloseNode);
    namesPlaceholder.appendChild(lorenPlaceholder);

    const data = [
      [
        "name1",
        "name2"
      ],
      [
        "name3",
        "name4"
      ]
    ];

    itemsPlaceholder.populate(data);

    const parentNodeXMLString = serializer.serializeToString(parentNode).replace(/\s+/g, "");
    const expectedOutputXMLString = serializer.serializeToString(expectedOutputXML).replace(/\s+/g, "");

    expect(expectedOutputXMLString == parentNodeXMLString).toBe(true);
  });
});
