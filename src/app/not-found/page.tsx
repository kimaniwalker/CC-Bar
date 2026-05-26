import { Text } from "@/components/ds/Text";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Text size="xxl" className="text-6xl font-bold mb-4">
        404
      </Text>
      <span className="text-xl text-gray-600">Page Not Found</span>
    </div>
  );
}
