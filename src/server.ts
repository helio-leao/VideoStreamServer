import express from "express";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";

const app = express();

const videoPath = path.join(path.resolve(), "files", "video.mp4");

app.get("/", async (req, res) => {
  const { size } = await stat(videoPath);
  const { range } = req.headers;

  if (range) {
    let [startString, endString] = range.replace(/bytes=/, "").split("-");
    const start = parseInt(startString, 10);
    const end = endString ? parseInt(endString, 10) : size - 1;

    res.writeHead(206, {
      "content-range": `bytes ${start}-${end}/${size}`,
      "accept-ranges": "bytes",
      "content-length": start - end + 1,
      "content-type": "video/mp4",
    });
    createReadStream(videoPath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      "content-type": "video/mp4",
      "content-length": size,
    });
    createReadStream(videoPath).pipe(res);
  }
});

app.listen(3000, () => console.log("Server running..."));
