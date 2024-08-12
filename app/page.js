import { Divide } from "lucide-react";
import Image from "next/image";
import Hero from "./_components/Hero";
import Link from "next/link";

export default function Home() {
  return (
    <section className="bg-gray-50">
    <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen ">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-extrabold sm:text-5xl">
          Create Form in minutes
          <strong className="font-extrabold text-red-500 sm:block"> Not hours! </strong>
        </h1>
  
        <p className="mt-4 sm:text-xl/relaxed">
        From Idea to Form in Minutes: Customize with Ease!
        </p>
  
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            className="block w-full rounded bg-blue-500 px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-500 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
            href={'/dashboard'}
          >
            Create Form
          </Link>
  
          <a
            className="block w-full rounded px-12 py-3 text-sm font-medium text-red-600 shadow hover:text-red-700 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
            href="#"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  </section>
  );
}
