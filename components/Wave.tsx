import clsx from "clsx";

import style from "./Wave.module.css";

interface WaveProps {
  play: boolean;
}

export default function Wave({ play = false }: WaveProps) {
  return (
    <div className={clsx(style.recorder, play && style.animation)}>
      <div className={style.wave} />
      <div className={style.wave} />
      <div className={style.wave} />
      <div className={style.wave} />
      <div className={style.wave} />
      <div className={style.wave} />
      <div className={style.wave} />
      <div className={style.wave} />
      <div className={style.wave} />
      <div className={style.wave} />
      <div className={style.wave} />
      <div className={style.wave} />
      <div className={style.wave} />
    </div>
  );
}
