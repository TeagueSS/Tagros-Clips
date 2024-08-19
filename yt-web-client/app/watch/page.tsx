'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function Watch() {

  
  const searchParams = useSearchParams();
  const videoPrefix = 'https://storage.googleapis.com/ts-yt-processed-videos/';
  const videoSrc = searchParams.get('v');
  
  return (
    <div>
      <h1>Watch Page</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {videoSrc ? (
          <video controls src={`${videoPrefix}${videoSrc}`} />
        ) : (
          <p>Video not found</p>
        )}
      </Suspense>
    </div>
  );
}
