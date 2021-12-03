// @ts-nocheck
import { fabric } from 'fabric'
import { ObjectType } from '../common/constants'
import { HandlerOptions } from '../common/interfaces'
import BaseHandler from './BaseHandler'

function rotatedPoint(point, angle, center) {
  angle = (Math.PI / 180) * angle
  return {
    x: (point.x - center.x) * Math.cos(angle) - (point.y - center.y) * Math.sin(angle) + center.x,
    y: (point.x - center.x) * Math.sin(angle) + (point.y - center.y) * Math.cos(angle) + center.y
  }
}

class CropHandler extends BaseHandler {
  private cropped
  constructor(props: HandlerOptions) {
    super(props)
    this.initialize()
  }
  private initialize = () => {
    this.canvas.on('mouse:dblclick', event => {
      const target = event.target
      if (target) {
        if (target.type === ObjectType.STATIC_IMAGE || target.type === 'image') {
          this.initCrop()
        }
      }
    })
  }

  getCanvasBoundingClientRect = () => {
    const canvasEl = document.getElementById('canvas')
    const position = {
      left: canvasEl?.getBoundingClientRect().left,
      top: canvasEl?.getBoundingClientRect().top
    }
    return position
  }

  public initCrop = () => {
    const cropped = this.canvas.getActiveObject()
    if (cropped) {
      //   @ts-ignore
      const _cropInfo = cropped._cropInfo
      // @ts-ignore
      const _original = cropped._original
      const original = _original ? _original : cropped
      // @ts-ignore
      cropped._original = original
      const cropInfo = _cropInfo
        ? _cropInfo
        : { top: 0, left: 0, width: original.width, height: original.height }

      const np = rotatedPoint(
        {
          x: cropped.left - cropInfo.left * cropped.scaleX,
          y: cropped.top - cropInfo.top * cropped.scaleY
        },
        cropped.angle - original.angle,
        { x: cropped.left, y: cropped.top }
      )
      this.cropped = cropped
      cropped.clipPath = null
      fabric.Image.fromURL(cropped._original.toDataURL(), background => {
        fabric.Image.fromURL(cropped._original.toDataURL(), nextCropped => {
          background.set({
            id: 'background',
            state: 'crop_state',
            left: np.x,
            top: np.y,
            width: original.width,
            height: original.height,
            scaleX: cropped.scaleX,
            scaleY: cropped.scaleY,
            angle: cropped.angle,
            evented: false,
            selectable: false
          })

          nextCropped.set({
            id: 'cropped',
            state: 'crop_state',
            left: np.x,
            top: np.y,
            width: original.width,
            height: original.height,
            scaleX: cropped.scaleX,
            scaleY: cropped.scaleY,
            angle: cropped.angle,
            evented: false,
            selectable: false
          })

          const cropper = new fabric.Rect({
            id: 'cropper',
            state: 'crop_state',
            top: 0,
            left: 0,
            absolutePositioned: true,
            backgroundColor: 'rgba(0,0,0,0)',
            opacity: 0.00001
          })

          cropper.set({
            top: cropped.top,
            left: cropped.left,
            width: cropped.width,
            height: cropped.height,
            scaleX: cropped.scaleX,
            scaleY: cropped.scaleY,
            angle: cropped.angle
          })

          cropper.setControlsVisibility({
            mtr: false,
            mt: false,
            ml: false,
            mr: false,
            mb: false
          })

          nextCropped.clipPath = cropper

          const overlay = new fabric.Rect({
            id: 'overlay',
            state: 'crop_state',
            top: -25000,
            left: -25000,
            width: 50000,
            height: 50000,
            fill: '#000000',
            opacity: 0.25,
            selectable: false,
            evented: false
          })

          this.canvas.add(background)
          this.canvas.add(overlay)
          this.canvas.add(nextCropped)
          this.canvas.add(cropper)
          nextCropped.bringToFront()
          cropper.bringToFront()
          this.canvas.requestRenderAll()
          cropper._original = original
          cropper._cropped = nextCropped
          this.canvas.remove(cropped)
          this.canvas.setActiveObject(cropper)
          const canvasPosition = this.getCanvasBoundingClientRect()
          let cropperBoundingRect = cropper.getBoundingRect()
          this.context.setCropMenu({
            visible: true,
            top: canvasPosition.top + cropperBoundingRect.top + cropperBoundingRect.height,
            left: canvasPosition.left + cropperBoundingRect.left + cropperBoundingRect.width / 2
          })
          cropper.on('moving', () => {
            cropperBoundingRect = cropperBoundingRect = cropper.getBoundingRect()
            this.context.setCropMenu({
              visible: true,
              top: canvasPosition.top + cropperBoundingRect.top + cropperBoundingRect.height,
              left: canvasPosition.left + cropperBoundingRect.left + cropperBoundingRect.width / 2
            })
          })
          cropper.on('scaling', () => {
            cropperBoundingRect = cropperBoundingRect = cropper.getBoundingRect()
            this.context.setCropMenu({
              visible: true,
              top: canvasPosition.top + cropperBoundingRect.top + cropperBoundingRect.height,
              left: canvasPosition.left + cropperBoundingRect.left + cropperBoundingRect.width / 2
            })
          })
        })
      })
    }
  }
  public applyCrop = () => {
    const cropper = this.canvas.getActiveObject()
    const original = cropper._original
    const cropped = cropper._cropped
    const sX = cropped.scaleX
    const sY = cropped.scaleY

    original.set({
      angle: 0,
      scaleX: sX,
      scaleY: sY
    })

    cropper.set({
      width: cropper.width * cropper.scaleX, //this.width * this.scaleX
      height: cropper.height * cropper.scaleY,
      scaleX: 1,
      scaleY: 1
    })

    this.canvas.remove(cropped)
    original.set({
      scaleX: 1,
      scaleY: 1,
      top: cropped.top,
      left: cropped.left
    })

    const np = rotatedPoint({ x: cropper.left, y: cropper.top }, -cropper.angle, {
      x: original.left,
      y: original.top
    })

    const cropInfo = {
      top: (np.y - original.top) / sY,
      left: (np.x - original.left) / sX,
      width: cropper.width / cropped.scaleX,
      height: cropper.height / cropped.scaleY
    }

    fabric.Image.fromURL(original.toDataURL(cropInfo), cropped => {
      cropped.set({
        left: cropper.left,
        top: cropper.top,
        angle: cropper.angle,
        lockScalingFlip: true,
        scaleX: sX,
        scaleY: sY,
        width: cropper.width / sX,
        height: cropper.height / sY
      })
      cropped._original = original

      cropped._cropInfo = { ...cropInfo, initiated: true }
      this.canvas.add(cropped)
      this.context.setCropMenu({ visible: false, top: 0, left: 0 })
      this.canvas.getObjects().forEach(o => {
        if (o.state === 'crop_state') {
          this.canvas.remove(o)
        }
      })
    })
  }
  public cancelCrop = () => {
    this.canvas.add(this.cropped)
    this.cropped = null
    this.canvas.getObjects().forEach(o => {
      if (o.state === 'crop_state') {
        this.canvas.remove(o)
      }
    })
    this.context.setCropMenu({
      visible: false,
      top: 0,
      left: 0
    })
  }
}

export default CropHandler
