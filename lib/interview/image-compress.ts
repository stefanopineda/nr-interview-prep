import sharp from "sharp"

const MAX_DIMENSION = 1024
const JPEG_QUALITY = 60

/**
 * Compresses a base64-encoded image for the OpenAI Vision API.
 * Resizes to max 1024x1024, converts to JPEG at quality 60, strips metadata.
 * Typically reduces a ~500KB canvas export to ~50-80KB.
 *
 * Returns base64 JPEG (no data URL prefix).
 */
export async function compressWhiteboardImage(base64Image: string): Promise<string> {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "")
  const buffer = Buffer.from(base64Data, "base64")

  const compressed = await sharp(buffer)
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer()

  return compressed.toString("base64")
}

/**
 * Returns true if the image is essentially blank (all one color).
 * Used to short-circuit Vision calls when the candidate submits empty whiteboard.
 */
export async function isBlankImage(base64Image: string): Promise<boolean> {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "")
  const buffer = Buffer.from(base64Data, "base64")

  const { channels } = await sharp(buffer).stats()
  const avgStdDev = channels.reduce((sum, ch) => sum + ch.stdev, 0) / channels.length

  return avgStdDev < 5
}
