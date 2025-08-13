import { ThemeProvider } from "@/providers/ThemeProvider";
import ClientLayout from "@/providers/ClientLayout";
import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/context/ToasterProvider";

export const metadata: Metadata = {
  title: "ClarityHub",
  description: "AI-powered data insights dashboard",
  viewport: "width=device-width, initial-scale=1", 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider 
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
            <ToastProvider>
                <ClientLayout>
                  {children}
                </ClientLayout>
            </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}