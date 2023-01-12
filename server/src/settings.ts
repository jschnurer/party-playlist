import fs from "fs";

const settingsJson = JSON.parse(fs.readFileSync("./local.settings.json", "utf8"));

export interface ISettings {
  httpPort: number,
}

const settings = settingsJson as ISettings;
export default settings;