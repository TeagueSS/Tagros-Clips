import Image from "next/image";
import Link from 'next/link';
import styles from "./page.module.css";
import { getVideos } from "./firebase/functions";


export default async function Home() {
  //Getting our videos 
  const videos = await getVideos();
  return (
    <main>
      {
        videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`} key={video.id}>
       <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
        className={styles.thumbnail}/>
      </Link>
        ))
      }
    </main>
  )
}

// Making to that we refresh our page every 30 seconds for the user 
export const revalidate = 30;
