import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'React Frontend',
    description: (
      <>
        Modern React application with component-based architecture,
        built with Tailwind CSS for responsive design.
      </>
    ),
  },
  {
    title: 'Python Backend',
    description: (
      <>
        Robust Flask API providing RESTful endpoints,
        comprehensive testing, and Docker containerization.
      </>
    ),
  },
  {
    title: 'Well Documented',
    description: (
      <>
        Complete documentation using Docusaurus,
        covering setup, architecture, and API endpoints.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
