import { CodeBlock } from '.'
import { cssKeepAliveDemo } from '../KeepAliveDemo'

export const CodeBlockDemo = () => {
  return (
    <div className={cssKeepAliveDemo}>
      <CodeBlock
        language='typescript'
        darkMode={false}
        maxHeight={500}
        style={{ overflow: 'auto' }}>
        {`
 <CodeBlock language='typescript' darkMode={false} maxHeight={500} style={{ overflow: 'auto' }}>
        coding....
    </CodeBlock>
`}
      </CodeBlock>
    </div>
  )
}
