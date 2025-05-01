"use client";

import NextTopLoader from "nextjs-toploader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NextTopLoader 
        color="#2563eb"
        showSpinner={false}
        height={3}
        shadow="0 0 10px rgba(37, 99, 235, 0.7)"
      />
      {children}
    </>
  );
}