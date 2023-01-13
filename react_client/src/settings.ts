interface ISettings {
  baseApiEndpoint: string,
  socketEndpoint: string,
  youtubeApiKey: string,
  baseUrl: string,
}

const settings = (window as any).__settings as ISettings;

export default settings;