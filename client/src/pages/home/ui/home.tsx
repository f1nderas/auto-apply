import { Link } from 'react-router-dom';
import { PROFILES } from '@entities/resume';
import './home.scss';

// #region CONSTANT
const EXPERIENCE: Record<string, string> = {
  '08a5aea1ff1024b7b80039ed1f69426f49744f': '4.7 лет опыта',
  '5582453fff10341d340039ed1f734d425a7251': '2.8 лет опыта',
};
// #endregion

const Home = () => (
  <div className="home">
    {PROFILES.map((r) => (
      <Link key={r.hash} to={`/resume/${r.hash}`} className="home__card">
        <span className="home__card-name">{r.name}</span>
        <span className="home__card-exp">{EXPERIENCE[r.hash]}</span>
      </Link>
    ))}
  </div>
);

export { Home };
