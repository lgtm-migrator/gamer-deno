import { Embed as EmbedData, EmbedAuthor, EmbedField, EmbedFooter, EmbedImage } from "../../deps.ts";

const embedLimits = {
  title: 256,
  description: 2048,
  fieldName: 256,
  fieldValue: 1024,
  footerText: 2048,
  authorName: 256,
  fields: 25,
  total: 6000,
};

export class Embed {
  /** The amount of characters in the embed. */
  currentTotal = 0;
  /** Whether the limits should be enforced or not. */
  enforceLimits = true;
  /** If a file is attached to the message it will be added here. */
  embedFile: EmbedFile[] = [];

  color = 0x41ebf4;
  fields: EmbedField[] = [];
  author?: EmbedAuthor;
  description?: string;
  footer?: EmbedFooter;
  image?: EmbedImage;
  timestamp?: string;
  title?: string;
  thumbnail?: EmbedImage;
  url?: string;

  constructor(data?: Omit<EmbedData, "color"> & { color: number | string }, enforceLimits = true) {
    // By default we will always want to enforce discord limits but this option allows us to bypass for whatever reason.
    if (!enforceLimits) this.enforceLimits = false;

    // Prefills the embed based on an embed object like message.embeds[0]
    if (data) {
      if (typeof data.color === "string") {
        if (data.color.toLowerCase() === "random") {
          data.color = Math.floor(Math.random() * (0xffffff + 1));
        } else if ((data.color as string).startsWith("#")) {
          data.color = parseInt((data.color as string).replace("#", ""), 16);
        } else data.color = 0;
      }

      if (data.timestamp) data.timestamp = new Date().toISOString();
      if (data.title) this.title = data.title;
      if (data.url) this.url = data.url;
      if (data.description) this.description = data.description;
      if (data.timestamp) this.timestamp = data.timestamp;
      if (data.color) this.color = data.color;
      if (data.footer) this.footer = data.footer;
      if (data.fields) this.fields = data.fields;

      if (data.image && typeof data.image === "string") {
        this.image = { url: data.image };
      } else if (data.image) this.image = data.image;

      if (data.thumbnail && typeof data.thumbnail === "string") {
        data.thumbnail = { url: data.thumbnail };
      }
      if (data.thumbnail) this.thumbnail = data.thumbnail;
      if (data.author) this.author = data.author;
    }

    return this;
  }

  /** Make the data complient to discords embed limit. Warning: this can remove data */
  fitData(data: string, max: number) {
    // If the string is bigger then the allowed max shorten it.
    if (data.length > max) data = data.substring(0, max);
    // Check the amount of characters left for this embed
    const availableCharacters = embedLimits.total - this.currentTotal;
    // If it is maxed out already return empty string as nothing can be added anymore
    if (!availableCharacters) return ``;
    // If the string breaks the maximum embed limit then shorten it.
    if (this.currentTotal + data.length > embedLimits.total) {
      return data.substring(0, availableCharacters);
    }
    // Return the data as is with no changes.
    return data;
  }

  /** Set the author */
  setAuthor(name: string, icon?: string, url?: string) {
    const finalName = this.enforceLimits ? this.fitData(name, embedLimits.authorName) : name;
    this.author = { name: finalName, iconUrl: icon, url };

    return this;
  }

  /** Set the color  */
  setColor(color: string) {
    this.color =
      color.toLowerCase() === `random`
        ? // Random color
          Math.floor(Math.random() * (0xffffff + 1))
        : // Convert the hex to a acceptable color for discord
          parseInt(color.replace("#", ""), 16);

    return this;
  }

  /** Set the description */
  setDescription(description: string | string[]) {
    if (typeof description !== "string") description = description.join("\n");

    this.description = this.fitData(description, embedLimits.description);

    return this;
  }

  /** Add a field */
  addField(name: string, value: string, inline = false) {
    if (this.fields.length >= 25) return this;

    this.fields.push({
      name: this.fitData(name, embedLimits.fieldName),
      value: this.fitData(value, embedLimits.fieldValue),
      inline,
    });

    return this;
  }

  /** Add a blank field */
  addBlankField(inline = false) {
    return this.addField("\u200B", "\u200B", inline);
  }

  /** Attach a file. Also sets the embeds image by default */
  attachFile(file: Blob, name: string, setImage = true) {
    this.embedFile.push({ blob: file, name });
    if (setImage) this.setImage(`attachment://${name}`);

    return this;
  }

  // TODO: proper check, requires title.url to be set
  /** Attach multiple files */
  attachFiles(files: EmbedFile[]) {
    this.embedFile.push(...files);

    return this;
  }

  /** Set the footer */
  setFooter(text: string, icon?: string) {
    this.footer = {
      text: this.fitData(text, embedLimits.footerText),
      iconUrl: icon,
    };

    return this;
  }

  /** Set the image */
  setImage(url: string) {
    this.image = { url };

    return this;
  }

  /** Set the timestamp, defaults to now */
  setTimestamp(time = Date.now()) {
    this.timestamp = new Date(time).toISOString();

    return this;
  }

  /** Set the title */
  setTitle(title: string, url?: string) {
    this.title = this.fitData(title, embedLimits.title);
    if (url) this.url = url;

    return this;
  }

  /** Set the thumbnail */
  setThumbnail(url: string) {
    this.thumbnail = { url };

    return this;
  }
}

export interface EmbedFile {
  blob: Blob;
  name: string;
}
