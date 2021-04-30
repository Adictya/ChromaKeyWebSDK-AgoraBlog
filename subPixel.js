data[2] = 254;
data[2 + 4] = 254;
data[streamCanvas.width + 2] = 254;
data[streamCanvas.width + 2 + 4] = 254;
data[1] = 254;
data[1 + 4] = 254;
data[streamCanvas.width + 1] = 254;
data[streamCanvas.width + 1 + 4] = 254;
data[0] = 254;
data[0 + 4] = 254;
data[streamCanvas.width + 0] = 254;
data[streamCanvas.width + 0 + 4] = 255;
for (let i = 0; i < length; i += 8) {
  if (i % streamCanvas.width == 0) i += streamCanvas.width + 1;
  if (i > length) break;
  const red =
    (data[i + 0] +
      data[i + 4 + 0] +
      data[i + streamCanvas.width + 0] +
      data[i + streamCanvas.width + 4 + 0]) /
    4;
  const green =
    (data[i + 1] +
      data[i + 4 + 1] +
      data[i + streamCanvas.width + 1] +
      data[i + streamCanvas.width + 4 + 1]) /
    4;
  const blue =
    (data[i + 2] +
      data[i + 4 + 2] +
      data[i + streamCanvas.width + 2] +
      data[i + streamCanvas.width + 4 + 2]) /
    4;
  if (
    green > greenLL &&
    green < greenUL &&
    red > redLL &&
    red < redUL &&
    blue > blueLL &&
    blue < blueUL
  ) {
    // if (i % 16 == 0)
    // i += streamCanvas.width + 1;
    data[i + 4] = 0;
    data[i + 4 + 4] = 0;
    data[i + streamCanvas.width + 4] = 0;
    data[i + streamCanvas.width + 4 + 4] = 0;
  }
}
