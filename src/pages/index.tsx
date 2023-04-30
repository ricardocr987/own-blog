import { Button, Footer } from '@/components';
import { FeaturedPosts } from '@/sections';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="h-50 flex flex-col justify-center items-center gap-4 mb-8 lg:mb-10">
        <div className="text-white text-lg md:text-2xl font-bold flex justify-center items-center text-center">
          <div className='px-2'>Monetize on</div>
          <Image
            unoptimized
            width={130}
            height={130}
            alt={'solana'}
            src={'./solanaLogo.svg'}
          />
        </div>
        <div className="text-white text-lg md:text-2xl font-bold flex justify-center items-center text-center">
          Store on Aleph
        </div>
        <Link href={'/CreateArticle'}>
          <Button text="Start writing"/>
        </Link>
      </div>
      <div className="text-white text-lg md:text-2xl font-bold mb-8 lg:mb-10">
        Explore:
      </div>
      <FeaturedPosts />
      <Footer />
    </div>
  );
}