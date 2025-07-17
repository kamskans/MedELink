import styles from '@/styles/Hero.module.css'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1>
            Find a trusted and vetted<br />
            <span className={styles.highlight}>Specialist</span><br />
            for your rehabilitation clients
          </h1>
          <p>
            Connect with healthcare professionals who understand your clients' unique needs 
            and provide specialized care for optimal recovery outcomes.
          </p>
          <button className={styles.ctaButton}>Get Started</button>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/hero-image.avif"
            alt="Athlete on running track"
            width={400}
            height={300}
            className={styles.image}
            priority
          />
        </div>
      </div>
    </section>
  )
}