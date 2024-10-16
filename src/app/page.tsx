import MainCard from "@/components/MainCard";
import CardsChat from "../components/CardsChat";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-center mt-10 lg:text-5xl">
        Chatbot Translation App
      </h1>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        {/* <CardsChat /> */}
        <MainCard />
        <span className="text-sm text-muted-foreground">by Joe Morel</span>
      </main>
    </div>
  );
}
