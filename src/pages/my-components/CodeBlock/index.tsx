import { Highlight } from 'prism-react-renderer'
import { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FaCheck, FaCopy } from 'react-icons/fa'

type CodeBlockProps = {
  children: string
  language?: string
  showLineNumbers?: boolean
  className?: string
  style?: React.CSSProperties
  darkMode?: boolean
  showCopyButton?: boolean
  maxHeight?: string | number
}

export const CodeBlock = ({
  children,
  language = 'javascript',
  showLineNumbers = false,
  className = '',
  style = {},
  darkMode = true,
  showCopyButton = true,
  maxHeight = 'auto',
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  return (
    <div
      className={`relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}
      style={{ ...style, maxHeight }}>
      {showCopyButton && (
        <CopyToClipboard text={children.trim()} onCopy={() => setCopied(true)}>
          <button
            className='absolute right-2 top-2 p-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
            aria-label='Copy code'>
            {copied ? <FaCheck className='text-green-500' /> : <FaCopy />}
          </button>
        </CopyToClipboard>
      )}

      <Highlight code={children.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={className}
            style={{
              ...style,
              margin: 0,
              padding: '1rem',
              fontSize: '0.9rem',
              overflow: 'auto',
              maxHeight: maxHeight === 'auto' ? undefined : maxHeight,
            }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {showLineNumbers && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '2.25em',
                      color: darkMode ? '#6e7681' : '#999999',
                      userSelect: 'none',
                    }}>
                    {i + 1}
                  </span>
                )}
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
