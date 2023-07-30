import { RefObject } from "react"

const setImage = (ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {
  ctx.drawImage(image, 0, 0)
}

const loadImage = (canvas: RefObject<HTMLCanvasElement>, image: string) => {
  let bgImage = new Image()
  bgImage.src = image
  bgImage.onload = () => {
    if (!canvas.current) return
    const context = canvas.current.getContext("2d")
    if (context) {
      // getContext might return null if context identifier is not supported
      setImage(context, bgImage)
    }
  }
}

export { loadImage }
