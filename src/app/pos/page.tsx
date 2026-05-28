import PosContent from "@/components/client/Pos/PosContent";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PosContent />
    </Suspense>
  );
}
