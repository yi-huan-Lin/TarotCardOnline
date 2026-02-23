import { twMerge } from 'tailwind-merge'

// eslint-disable-next-line react/prop-types
const CardImg = ({ number, img, className, id }) => {
  const url = img ? img : `/cards/${number}.jpg`
  return <img id={id} className={twMerge("w-full rounded-md ", className)} src={url} alt="" />
}

export { CardImg }

