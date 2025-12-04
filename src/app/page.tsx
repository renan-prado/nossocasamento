import Image from "next/image";
import Link from "next/link";
import { Monograma } from '@/components/monograma'

export default function Home() {
  return (
    <main className="flex flex-col lg:flex-row bg-bege min-h-screen w-full">
      <section className="w-full lg:w-[40vw] p-4 flex flex-col lg:justify-between lg:h-screen">
        <header className="flex flex-row items-center text-green gap-4 lg:gap-10 mb-4 lg:mb-0 lg:h-16">
          <Monograma className="size-16 lg:size-30" />
          <nav className="w-full h-full">
            <ul className="w-full h-full font-niconne text-base lg:text-2xl opacity-85 text-green flex flex-row gap-2 lg:gap-4 items-center">
              <li>
                <Link href="/" className="hover:underline">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Cerimonia
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Confirmar presença
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <div className="w-full min-h-70 flex flex-col justify-center items-center px-4 lg:px-10 py-4 lg:h-full lg:py-0">
          <h1 className="text-2xl lg:text-6xl font-serif text-center"> Bem-vindo ao portal do nosso casamento! </h1>
        </div>

        <footer className="h-16 hidden lg:block">

        </footer>
      </section>

      <section className="flex flex-col lg:flex-row w-full lg:w-[60vw] gap-0 lg:gap-4">
        <div className="flex-1 bg-green relative image-container-mobile">
          <Image
            src="/nos.webp"
            alt=""
            fill
            className="object-cover w-full h-full grayscale"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="w-full h-full absolute top-0 left-0 bg-green/50" />
        </div>
        <div className="flex-1 bg-green relative image-container-mobile">
          <Image
            src="/nos-2.jpg"
            alt=""
            fill
            className="object-cover w-full h-full grayscale"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="w-full h-full absolute top-0 left-0 bg-green/50" />
        </div>
      </section>
    </main>
  );
}
