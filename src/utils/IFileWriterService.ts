export default interface IFileWriterService {
  writeFile(fileURL: string, content: string): Promise<string>;
}
