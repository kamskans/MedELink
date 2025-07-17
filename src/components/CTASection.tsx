import styles from '@/styles/CTASection.module.css'
import Image from 'next/image'

export default function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContent}>
        <div className={styles.ctaText}>
          <h2>Join medElink Today</h2>
          <p>
            Become a part of our growing network of healthcare management professionals 
            and start connecting with professionals effectively.
          </p>
          <button className={styles.ctaButtonWhite}>Get Started</button>
        </div>
        <div className={styles.ctaImage}>
          <Image
            src="/doctor-image.avif"
            alt="Healthcare professional"
            width={300}
            height={400}
            className={styles.image}
          />
        </div>
      </div>
    </section>
  )
}