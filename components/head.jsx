import Link from 'next/link';
import Image from 'next/image';
import config from '../config';

export default function Head({ name, description, logo }) {
  return (
    <>
      <meta charset="utf-8" />

      <title>{name}</title>

      <link rel="apple-touch-icon" sizes="180x180" href="/images/site/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/images/site/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/images/site/favicon-16x16.png" />
      <link rel="manifest" href="/images/site/site.webmanifest" />
      <link rel="mask-icon" href="/images/site/safari-pinned-tab.svg" color="#008bff" />
      <link rel="shortcut icon" href="/images/site/favicon.ico" />
      <meta name="msapplication-TileColor" content="#008bff" />
      <meta name="msapplication-TileImage" content="/images/site/mstile-144x144.png" />
      <meta name="msapplication-config" content="/images/site/browserconfig.xml" />
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
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&amp;display=swap" rel="stylesheet" />

      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous" />
      <link href="https://use.fontawesome.com/releases/v6.0.0/css/all.css" rel="stylesheet" />
      <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
    </>
  );
}