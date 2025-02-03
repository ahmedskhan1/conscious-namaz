import Image from 'next/image'
import Container from '../../Container'
import Link from 'next/link'
import Animate from '../../Animate'

const AboutWelcome = () => {
  return (
    <section>
      <figure className='relative overflow-hidden pb-[83%] sm:pb-[28.56%] '>
        <Image
          src={"/images/about-banner.webp"}
          fill
          alt='about banner'
          className='object-cover'
          priority={true}

        />
        <div className='absolute top-5 lg:top-10 left-0 w-full'>
          <Container>
            <Link href={"./"} className="inline-flex gap-3 items-center text-white text-lg lg:text-xl">
              <Image
                src={"/images/arrow-right.svg"}
                width={12}
                height={9}
                alt="arrow"
                className="scale-x-[-1] brightness-0 invert"
              />
              Back
            </Link>
          </Container>
        </div>
      </figure>
      <Container>
        <Animate className='text-center py-7 lg:py-12 text-primary'>
          <h1 className='h2 ff-2 mb-3 leading-[1.2]'>Welcome to Conscious Namaz</h1>
          <p className='text-xl tracking-[-0.2px]'>Making Namaz more Meaningful & Powerful</p>
        </Animate>
      </Container>
    </section>
  )
}

export default AboutWelcome
