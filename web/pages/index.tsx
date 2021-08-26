import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { draw } from './game';
import styles from '../styles/Home.module.css';

const Canvas = () => {
  const { data, error } = useSWR<{ time: number }>('/api/game-info', () => fetch('/api/game-info').then((res) => res.json()), { refreshInterval: 10, dedupingInterval: 10 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current || !data) return;
    console.log(data.time);
    draw(canvasRef.current, data.time);
  }, [canvasRef, error, data]);
  if (error) {
    return <div>Server error</div>;
  }
  return <canvas className={styles.canvas} width="400" height="450" ref={canvasRef} />;
}

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Polyglot Pendulum Demo</title>
      </Head>

      <main className={styles.main}>
        <h2 className={styles.title}>
          Pendulum powered by <a href="https://temporal.io">Temporal</a> Workflows
        </h2>

        <div className={styles.grid}>
          <Canvas />
        </div>
      </main>
    </div>
  );
}

export default Home
