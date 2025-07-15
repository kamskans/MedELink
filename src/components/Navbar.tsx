'use client'

import { useState, useEffect } from 'react'
import { useUser } from "@stackframe/stack"
import Link from 'next/link'
import styles from '@/styles/Navbar.module.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const user = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header>
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <Link href="/">
              <span className={styles.logoText}>medElink</span>
            </Link>
          </div>
          <ul className={`${styles.navMenu} ${isMenuOpen ? styles.active : ''}`}>
            <li><a href="#home" onClick={closeMenu}>Home</a></li>
            <li><a href="#services" onClick={closeMenu}>Services</a></li>
            <li><a href="#about" onClick={closeMenu}>About</a></li>
            <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
            {user ? (
              <>
                <li><Link href="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
                <li>
                  <button 
                    onClick={() => user.signOut()}
                    className={styles.authButton}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link href="/sign-in" onClick={closeMenu}>Sign In</Link></li>
                <li><Link href="/sign-up" onClick={closeMenu}>Sign Up</Link></li>
              </>
            )}
          </ul>
          <button 
            className={`${styles.navToggle} ${isMenuOpen ? styles.active : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>
      </nav>
    </header>
  )
}