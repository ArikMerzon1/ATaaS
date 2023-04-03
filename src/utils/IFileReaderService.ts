export default interface IFileReaderService {
  readFile(fileURL: string): Promise<string>;
}
