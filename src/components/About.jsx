import { Aperture, Infinity as InfinityIcon, ThumbsUp } from 'lucide-react';

const PILLARS = [
  {
    icon: Aperture,
    title: 'Real photography',
    text: 'Every image is served live by the Lorem Picsum API and credited to the photographer who made it.',
  },
  {
    icon: InfinityIcon,
    title: 'An endless stream',
    text: 'Pages arrive quietly as you scroll, appended beneath what you have already seen — until the archive ends.',
  },
  {
    icon: ThumbsUp,
    title: 'Every like counts',
    text: 'Each photograph keeps its own counter. Appreciate a frame as often as it moves you.',
  },
];

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="about__inner">
        <p className="eyebrow">About</p>
        <h2 id="about-title" className="about__title">
          Made for looking slowly.
        </h2>
        <p className="about__lede">
          PIXORA is a single-column photography feed: one frame at a time, presented large, with nothing
          competing for your attention.
        </p>
        <ul className="about__pillars">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Icon size={20} aria-hidden="true" className="about__icon" />
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
