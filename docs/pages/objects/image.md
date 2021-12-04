# Image

Images are supported by default. The following interface represents an image object:

```ts
interface StaticImage {
  angle?: number
  stroke?: string
  strokeWidth?: number
  left?: number
  top?: number
  width?: number
  height?: number
  opacity?: number
  originX?: string
  originY?: string
  scaleX?: number
  scaleY?: number
  type: string
  flipX?: false
  flipY?: false
  skewX?: number
  skewY?: number
  visible?: true
  metadata?: {
    src: string
    cropX?: number
    cropY?: number
  }
}
```

### Add

In order to add an image to the editor, `type` and `src` are required.

```js
const image = {
  type: 'StaticImage',
  metadata: {
    src: 'https://uploda.coma.up/download.png',
  },
}
editor.add(image)
```

### Update

In order to update an image, create an object with the new values listed above.

```js
const newValues = {
  top: 100,
  left: 100,
}
editor.update(newValues)
```
