import Link from 'next/link'
import type react from 'react'


interface linkProps {
  text: string,
  link?: string,
  textColor?: string,
  onClick?: () => void
}
const TextLink = (props: linkProps): JSX.Element => {

  return (
    <Link href={props.link || ''}>
      <a onClick={() => props.onClick && props.onClick()}>
        <h1 className="body-1 font-bold text-center"
          style={{ textDecorationColor: props.textColor, color: props.textColor, textDecoration: 'underline' }}>
          {props.text}
        </h1>
      </a>
    </Link>
  )
}

export default TextLink