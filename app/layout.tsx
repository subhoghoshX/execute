import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ex",
  description: "A simple and fast code editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          function setDarkMode() {
            const theme = localStorage.getItem("theme");
            if (theme === "dark") {
              document.documentElement.classList.add("dark");
            } else if (theme === "light") {
              document.documentElement.classList.remove("dark");
            } else {
              const isDark = window.matchMedia(
                "(prefers-color-scheme: dark)",
              ).matches;
              if (isDark) {
                document.documentElement.classList.add("dark");
              } else {
                document.documentElement.classList.remove("dark");
              }
            }
          }

          window.addEventListener("storage", setDarkMode);
          window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", setDarkMode);

          // for intial page load or reload
          setDarkMode();
          `}}>
        </script>
      </head>
      <body
        className={`${geistSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
