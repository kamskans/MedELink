import styles from '@/styles/CaseManagers.module.css'

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    title: 'Direct Referrals',
    description: 'Send direct referrals to our network of trusted healthcare professionals and track client progress throughout their treatment journey.',
    color: 'blue'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    title: 'Governance Assured',
    description: 'All healthcare professionals are verified for governance and frequency standards to ensure quality care delivery.',
    color: 'green'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Healthcare Network',
    description: 'Access to our extensive network to build a trusted treatment network for offering the best care possible.',
    color: 'purple'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: 'Work Onsite',
    description: 'Specialists can work onsite at your rehabilitation facility to provide seamless integrated care for your clients.',
    color: 'teal'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
      </svg>
    ),
    title: 'Secure Payment',
    description: 'Our secure payment systems ensure timely and reliable compensation for all healthcare professionals in our network.',
    color: 'gray'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    ),
    title: 'Regular Feedback',
    description: 'Receive regular feedback from healthcare professionals and track client progress to ensure optimal care delivery.',
    color: 'indigo'
  }
]

export default function CaseManagers() {
  return (
    <section className={styles.caseManagers}>
      <div className={styles.container}>
        <h2>Case Managers</h2>
        <p className={styles.sectionSubtitle}>
          Our platform connects case managers with trusted healthcare professionals to streamline 
          client care coordination and ensure the best possible outcomes for rehabilitation clients.
        </p>
        
        <div className={styles.featuresGrid}>
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles[feature.color]}`}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.featuresGridBottom}>
          {features.slice(3).map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles[feature.color]}`}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}