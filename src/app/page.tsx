// import Link from "next/link";
// import { headers } from "next/headers";
// import Image from "next/image";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const images = await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });

  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {(!images || images.length < 1) && <h1>No images Available...</h1>}
        {[...images, ...images, ...images].map((image, index) => (
          <div key={image.id + "-" + index} className="w-48">
            <img src={image.url} width={400} height={300} alt={image.name} />
          </div>
        ))}
      </div>
      Hello (Gallery in progress...)
    </main>
  );
}
