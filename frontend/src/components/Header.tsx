import Link from 'next/link'
import { useState } from 'react'

type NavItem = {
  href: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/lessons', label: 'Lessons' },
  { href: '/about', label: 'About' },
  { href: '/my-purchased-lessons', label: 'My Purchased Lessons' },
] as const

const PROFILE_MENU_ITEMS: NavItem[] = [
  { href: '/profile', label: 'Profile' },
  { href: '/logout', label: 'Logout' },
] as const

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen)
  const toggleColorMode = () => setIsDarkMode(!isDarkMode)

  return (
    <header className="w-full border-b bg-white dark:bg-gray-800 dark:border-gray-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/">
            <div className="text-lg md:text-xl font-semibold dark:text-white">
              Teach Niche
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center gap-6">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  {label}
                </button>
              </Link>
            ))}
          </nav>

          <div className="flex gap-2">
            <button
              onClick={toggleColorMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              aria-label={`Toggle ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            {/* Desktop Profile Menu */}
            <div className="hidden md:block relative">
              <button
                onClick={toggleProfile}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                aria-label="User menu"
              >
                👤
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700">
                  <div className="py-1">
                    {PROFILE_MENU_ITEMS.map(({ href, label }) => (
                      <Link key={href} href={href}>
                        <div className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                          {label}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={toggleMenu}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={toggleMenu}>
          <div className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-800">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button 
                onClick={toggleMenu}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-4">
                {NAV_ITEMS.map(({ href, label }) => (
                  <Link key={href} href={href}>
                    <button 
                      className="w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      onClick={toggleMenu}
                    >
                      {label}
                    </button>
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  {PROFILE_MENU_ITEMS.map(({ href, label }) => (
                    <Link key={href} href={href}>
                      <button 
                        className="w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        onClick={toggleMenu}
                      >
                        {label}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header 
