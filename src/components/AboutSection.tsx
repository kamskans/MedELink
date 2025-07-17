import styles from '@/styles/AboutSection.module.css'
import Image from 'next/image'

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <h2>About medElink</h2>
            <p>
              At medElink, we are dedicated to revolutionizing the process of healthcare coordination 
              by providing a trusted network of healthcare professionals committed to delivering quality care.
            </p>
            
            <ul className={styles.aboutFeatures}>
              <li>• Advanced online platform for scheduling management of healthcare professionals and facilities.</li>
              <li>• Comprehensive compliance support for healthcare practitioners ensuring they meet all regulatory requirements.</li>
              <li>• Real-time reporting and analytics for improved healthcare outcomes.</li>
              <li>• 24/7 clinical support and guidance to healthcare professionals.</li>
              <li>• And much more...</li>
            </ul>
            
            <p>
              Our mission is to transform the healthcare experience by providing seamless coordination 
              between case managers, healthcare professionals, and rehabilitation facilities, fostering 
              innovative care delivery methods.
            </p>
          </div>
          <div className={styles.aboutImage}>
            <Image
              src="/about-image.avif"
              alt="Healthcare team"
              width={500}
              height={400}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  )
}