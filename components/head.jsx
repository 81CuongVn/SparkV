import Link from 'next/link';
import Image from 'next/image';

import config from '../config';

export default function Head({ name, description, logo }) {
  return (
    <>
      <title>{config.meta.title}</title>

      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
      <link rel="manifest" href="site.webmanifest" />
      <link rel="mask-icon" href="safari-pinned-tab.svg" color="#008bff" />
      <link rel="shortcut icon" href="favicon.ico" />
      <meta name="msapplication-TileColor" content="#008bff" />
      <meta name="msapplication-TileImage" content="mstile-144x144.png" />
      <meta name="msapplication-config" content="browserconfig.xml" />
      <meta name="theme-color" content="#008bff" />

      <meta name="image" content="https://www.sparkv.tk/assets/images/SparkV.png" />
      <meta name="description" content={description} />
      <meta name="author" content="KingCh1ll" />
      <meta name="keywords" content="<% keywords %>" />
      <meta name="robots" content="all" />

      <meta name="twitter:title" content={config.meta.title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://www.sparkv.tk/assets/images/SparkV.png" />
      <meta name="twitter:creator" content="KingCh1ll" />
      <meta name="twitter:site" content="https://www.sparkv.tk/" />
      <meta name="twitter:card" content="summary" />

      <meta name="og:title" content={config.meta.title} />
      <meta name="og:description" content={description} />
      <meta property="og:image" content={logo} />
      <meta property="og:locale" content="en_US" />

      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <link rel="canonical" href="https://www.sparkv.tk/" />

      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet" />
    </>
  );
}