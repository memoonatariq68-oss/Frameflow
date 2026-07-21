import './globals.css';

export const metadata = {
  title: 'Frameflow — Turn a script into a video',
  description: 'Paste a script, get a finished one-minute video. Powered by JSON2Video.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
