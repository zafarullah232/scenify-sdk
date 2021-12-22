import * as React from 'react'

import useAppContext from '../../../../../hooks/useAppContext'
import { useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { Input } from 'baseui/input'
import Icons from '../../../../../components/icons'
import { useEditor } from '../../../../../../../src'
import { templates as tts } from '../../../../../constants/templates'

function Templates() {
  const inputFile = React.useRef<HTMLInputElement>(null)
  const editor = useEditor()

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <Scrollbars>
          <div
            style={{ display: 'grid', gap: '0.5rem', padding: '0 2rem 2rem', gridTemplateColumns: '1fr 1fr' }}
          >
            {tts.map(template => (
              <div
                key={template}
                style={{
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(0,0,0,0.2)',
                  padding: '5px'
                }}
                onClick={() => editor.loadTemplateSVG(template)}
              >
                <img width="100%" src={template} alt="preview" />
              </div>
            ))}
          </div>
        </Scrollbars>
      </div>
    </div>
  )
}

export default Templates
