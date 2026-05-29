"use client";

import { Text } from "@/components/ds/Text";
import { useUser } from "../Auth/AuthContext";
import { QrCode, Download, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { useMediaQuery } from "react-responsive";

export function MemberQRCode() {
  const { user } = useUser();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Get base URL from environment variable
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://candlecowbar.com";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user?.id || !qrCodeRef.current || !mounted) return;

    // Responsive size: smaller on mobile
    const size = isMobile ? 240 : 280;

    // Create full URL for POS page with user_id
    const posUrl = `${baseUrl}/pos?user_id=${user.id}`;

    const qr = new QRCodeStyling({
      width: size,
      height: size,
      data: posUrl,
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "H",
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 8,
      },
      dotsOptions: {
        type: "rounded",
        color: "#000000",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#000000",
      },
      cornersDotOptions: {
        type: "dot",
        color: "#000000",
      },
    });

    qrCodeRef.current.innerHTML = "";
    qr.append(qrCodeRef.current);
    setQrCode(qr);
  }, [user?.id, isMobile, mounted, baseUrl]);

  const handleDownload = () => {
    if (!qrCode) return;
    qrCode.download({
      name: "member-qr-code",
      extension: "png",
    });
  };

  const handleShare = async () => {
    if (!qrCode) return;

    try {
      const blob = await qrCode.getRawData("png");
      if (!blob) return;

      const file = new File([blob], "member-qr-code.png", {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Member QR Code",
          text: "Scan this code at checkout",
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch (error) {
      console.error("Error sharing QR code:", error);
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-4 h-10 w-full animate-pulse rounded bg-neutral-200" />
        <div className="mx-auto h-60 w-60 animate-pulse rounded-2xl bg-neutral-200" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3 md:mb-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black">
          <QrCode className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <Text size="lg" className="font-semibold">
            Member QR Code
          </Text>
          <Text size="sm" className="text-neutral-600">
            Scan at checkout
          </Text>
        </div>
      </div>

      {/* QR Code - Constrained width on mobile */}
      <div className="mx-auto flex max-w-full justify-center overflow-hidden rounded-2xl bg-neutral-50 p-4 md:p-6">
        <div
          ref={qrCodeRef}
          className="max-w-full rounded-xl bg-white p-3 shadow-sm md:p-4"
          style={{ maxWidth: "100%" }}
        />
      </div>

      {/* Member ID */}
      <div className="mt-4 rounded-xl bg-neutral-50 p-3 text-center md:p-4">
        <Text
          size="xs"
          className="mb-1 uppercase tracking-wide text-neutral-500"
        >
          Member ID
        </Text>
        <Text size="sm" className="break-all font-mono font-semibold">
          {user?.id?.slice(0, 13).toUpperCase()}
        </Text>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2 md:gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 md:py-3"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
          <span className="sm:hidden">Save</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 rounded-2xl bg-black py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 md:py-3"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 rounded-xl bg-blue-50 p-3 md:p-4">
        <Text size="xs" className="leading-relaxed text-blue-900">
          💡 <span className="font-medium">Pro tip:</span> Show this QR code at
          the POS terminal to instantly load your profile and earn rewards!
        </Text>
      </div>
    </div>
  );
}
