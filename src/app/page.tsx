// import Link from "next/link";
// import { headers } from "next/headers";
// import Image from "next/image";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { db } from "~/server/db";
import { UploadButton } from "~/utils/uploadthing";

export const dynamic = "force-dynamic";

async function Images() {
  const images = await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });

  return (
    <div className="flex flex-wrap gap-4">
      {(!images || images.length < 1) && <h1>No images Available...</h1>}
      {[...images, ...images, ...images].map((image, index) => (
        <div key={image.id + "-" + index} className="w-48">
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
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
        <Images />
      </SignedIn>
    </main>
  );
}
