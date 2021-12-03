import { useContext } from 'react'
import { EditorContext } from '../context'

export function useCropMenu() {
  const { cropMenu } = useContext(EditorContext)
  return cropMenu
}
