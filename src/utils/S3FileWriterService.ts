import AWS, { S3 } from "aws-sdk";
import { injectable } from "tsyringe";
import fs, { ReadStream } from "fs";
import path from "path";
import { HttpClient } from "typed-rest-client/HttpClient";
import axios from "axios";
import { IAWSArtifact } from "./IAWSArtifact";

@injectable()
export default class S3FileWriterService {
  set s3(value: S3) {
    this._s3 = value;
  }
  private bucket = `${process.env.BUCKET as string}/${Date.now()}`;
  // private fileWriterService: IFileWriterService;
  private _s3: S3 | undefined;

  constructor() {
    AWS.config.update({ region: process.env.AWS_REGION as string });
    // this.fileWriterService = new S3FileService(this.getS3());
  }

  private getS3(): S3 {
    if (!this._s3) {
      this.s3 = new S3();
    }
    return this._s3 as S3;
  }

  public async s3FileUploader(file: IAWSArtifact): Promise<void> {
    try {
      const { data, headers } = await axios.get(file.url, { responseType: "blob" });
      const fileBuffer = Buffer.from(data);
      const fileBufferArray = new Uint8Array(fileBuffer);
      fs.writeFileSync(`/Users/ariksmac/Desktop/${file.filename}`, fileBufferArray);

      const client = new HttpClient("clientTest");
      const response = await client.get(file.url);
      const filePath = `/Users/ariksmac/Desktop/${file.filename}`;
      const fileZ = fs.createWriteStream(filePath);

      // if (response.message.statusCode !== 200) {
      //   throw new Error(`Unexpected HTTP response: ${response.message.statusCode}`);
      // }
      // return new Promise((resolve, reject) => {
      //   fileZ.on("error", (err) => reject(err));
      //   const stream = response.message.pipe(fileZ);
      //   stream.on("close", () => {
      //     try {
      //       // @ts-ignore
      //       resolve(filePath);
      //     } catch (err) {
      //       reject(err);
      //     }
      //   });
      // });

      //
      // if (file.filename.includes("mp4")) headers = ["video/mp4"];
      //
      // const key = file.filename;
      // const objectParams = {
      //   Bucket: this.bucket,
      //   ContentLength: headers["content-length"],
      //   Body: data,
      //   ContentType: headers["content-type"],
      //   Key: key,
      // };
      // // data = await this.getS3().upload(objectParams).promise();
      // data = await this.getS3().putObject(objectParams).promise();
      // console.log(`File uploaded successfully. ${data.Location}`);
    } catch (err) {
      console.error(err);
    }
  }

  public async uploadFiles(filePath: string): Promise<void> {
    const uploadParams = { Bucket: process.env.BUCKET as string, Key: "", Body: "" };

    const readStream = fs.createReadStream(filePath);
    // eslint-disable-next-line func-names
    readStream.on("error", function (err) {
      console.error("File Error", err);
    });

    uploadParams.Body = await this.streamToString(readStream);
    uploadParams.Key = path.basename(filePath);

    try {
      await this._s3?.upload(uploadParams).promise();
    } catch (err) {
      console.error(err);
      throw Error(err);
    }
  }

  private async streamToString(stream: ReadStream): Promise<string> {
    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf-8");
  }
}
