import { Suspense } from "react";
import AboutProgram from "@/src/components/About/AboutProgram";

export default function Programs() {
  return (
    <>
      <Suspense fallback={
        <div className="w-full flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <AboutProgram />
      </Suspense>
    </>
  );
}
