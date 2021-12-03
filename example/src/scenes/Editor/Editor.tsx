import * as React from 'react'
import useAppContext from '../../hooks/useAppContext'
import api from '../../services/api'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Panels from './components/Panels'
import Toolbox from './components/Toolbox'
import Footer from './components/Footer'
import Editor, { useCropMenu, useEditor } from '../../../../src'

function App() {
  const { setTemplates, setShapes } = useAppContext()
  const cropMenu = useCropMenu()
  const editor = useEditor()
  useEffect(() => {
    api.getTemplates().then(templates => setTemplates(templates))
    api.getShapes().then(shapes => setShapes(shapes))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const editorConfig = {
    clipToFrame: true,
    scrollLimit: 0
  }
  console.log({ cropMenu })
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#F9F9F9',
        fontFamily: 'Uber Move Text',
        position: 'relative'
      }}
    >
      {cropMenu.visible && (
        <div
          style={{
            position: 'absolute',
            background: '#ffffff',
            top: cropMenu.top,
            left: cropMenu.left - 60,
            zIndex: 1,
            marginTop: '1rem',
            display: 'flex',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <div onClick={() => editor.applyCrop()} style={{ padding: '0.5rem' }}>
            Apply
          </div>
          <div onClick={() => editor.cancelCrop()} style={{ padding: '0.5rem' }}>
            Cancel
          </div>
        </div>
      )}
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Panels />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <Toolbox />
          <div style={{ flex: 1, display: 'flex', padding: '1px' }}>
            <Editor config={editorConfig} />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App
