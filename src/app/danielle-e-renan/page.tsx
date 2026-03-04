'use client'

import Image from "next/image";
import { AnimatedIconsBackground } from "@/components/animated-icons-background";
import { Countdown } from "@/components/countdown";
import { PhotosMosaic } from "@/components/photos-mosaic";
import { ScrollIndicator } from "@/components/scrool-indicator";
import { SnapSection } from "@/components/SnapSection";
import { RsvpSection } from "@/components/RsvpSection";
import { ToastContainer } from "@/components/ToastContainer";

export default function Home() {
  return (
    <main className="snap-y snap-mandatory overflow-hidden overflow-y-scroll h-screen w-screen">
      <SnapSection name="hero" className="bg-black px-6">
        <video
          src="/vezzane.mp4"
          poster="/vezzane-10.png"
          autoPlay
          loop
          muted
          playsInline
          className="absolute opacity-30 grayscale-100 top-0 left-0 w-full h-full object-cover"
        />
        {/* <div className="absolute top-0 left-0 w-full h-full bg-green/80" /> */}
        <h1 className="text-5xl sm:text-[100px] z-10 -rotate-6 opacity-90 leading-none text-center font-bold text-white font-serif">
          Danielle
          <br />
          <span className="text-2xl sm:text-[40px] relative -top-1 md:-top-5">and</span>
          <br />
          Renan
        </h1>
        <ScrollIndicator />
      </SnapSection>

      <SnapSection
        name="rsvp"
        className="bg-bege flex-col gap-8 px-6 py-10 text-green"
      >
        <Image
          src="/nos-mesmos/fundo-01.jpg"
          alt=""
          fill
          className="absolute inset-0 object-cover brightness-[0.20]"
          priority={false}
        />
        <RsvpSection />
      </SnapSection>

      <SnapSection
        name="countdown"
        className="bg-green flex-col gap-6 sm:gap-10 px-6"
      >
  
        <AnimatedIconsBackground />
        
        <div className="z-10">
          <Countdown expiryTimestamp={new Date('2026-06-25T15:00:00-03:00')} />
        </div>
        <h2 className="text-xl sm:text-xl font-bold text-green-foreground leading-8 sm:leading-8 font-serif max-w-sm text-center z-10">
          Faltam apenas alguns dias para o nosso grande dia!
        </h2>
      </SnapSection>

      <SnapSection name="venue" className="bg-bege px-6 py-8">
        <div className="relative z-10 flex flex-col gap-6 items-center text-center text-green">
          <div className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.6em] text-green font-semibold">Villa Vezzane</p>
            <h2 className="text-3xl font-serif font-bold leading-tight">25/06/26 · 15h</h2>
            <p className="text-sm text-green max-w-md font-serif">
              R. Benedito Fontana, 510 - Mairiporã, SP, 07627-200
            </p>
          </div>
          <div className="w-full max-w-3xl flex flex-col gap-3">
            <div className="overflow-hidden rounded-3xl">
              <Image
                src="/vezzane.jpg"
                alt="Villa Vezzane"
                width={1200}
                height={800}
                className="w-full h-64 object-cover sm:h-80"
                priority
              />
            </div>
            <a
              href="https://maps.app.goo.gl/78mTaqR8n51Ngy9A6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 self-center px-5 py-2.5 rounded-full border border-green/20 bg-white/70 backdrop-blur-sm text-sm font-semibold text-green shadow-sm hover:shadow-md hover:bg-white transition-all duration-200 mt-4"
            >
              <Image src="/google-maps-icon.svg" alt="Google Maps" width={18} height={18} />
              Ver no Google Maps
            </a>
          </div>
        </div>
      </SnapSection>

      <SnapSection name="photos" className="bg-black px-3 sm:px-6 py-6">
        <div className="relative z-10 flex h-full w-full flex-col items-center gap-4 pt-6 text-center text-bege">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold opacity-85">Te esperamos no nosso grande dia...</h2>
          <PhotosMosaic />
        </div>
      </SnapSection>
      <ToastContainer />
    </main>
  );
}
