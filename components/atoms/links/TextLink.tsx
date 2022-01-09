import Link from 'next/link'
import type react from 'react'


interface linkProps {
  text: string,
  link: string,
}

const TextLink = (props: linkProps): JSX.Element => {

  return (
    <Link href={props.link}>
      <a>
        <h1 className="body-1 font-bold">
          {props.text}
        </h1>
      </a>
    </Link>
  )
}

export default TextLink