// import Link from "next/link";
// import { headers } from "next/headers";
// import Image from "next/image";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

async function Images() {
  const images = await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });

  return (
    <div className="flex flex-wrap gap-4">
      {(!images || images.length < 1) && <h1>No images Available...</h1>}
      {images.map((image) => (
        <div key={image.id} className="w-48">
          <img src={image.url} width={400} height={300} alt={image.name} />
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please Sign In Above...
        </div>
      </SignedOut>
      <SignedIn>
        <Images />
      </SignedIn>
    </main>
  );
}
