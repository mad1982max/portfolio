import { PORTFOLIO_CONFIG } from '../config/portfolio';

export default function AboutPage() {
  return (
    <main>
      <section aria-label="Biography">
        <h1>About Me</h1>
        <p>
          Welcome to my portfolio. I am a passionate developer who loves building great software.
        </p>
      </section>
      <section aria-label="Skills">
        <h2>Skills</h2>
        <ul>
          {PORTFOLIO_CONFIG.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
