export class UtilsString {
  static fixPlaceholders(xmlString: string) {
    return xmlString.replace(/\{(.*?)\}/g, (_match, content) => {
      let cleanContent = content.replace(/<[^>]+>/g, "");
      return `{${cleanContent}}`;
    });
  }
}
