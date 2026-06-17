import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32'>
      <div className='flex flex-wrap justify-between gap-12 md:gap-6'>

        {/* Left Section */}
        <div className='max-w-80'>
          <img
            src={assets.logo}
            alt='logo'
            className='mb-4 h-8 md:h-9'
          />

          <p className='text-sm leading-7'>
            QuickAI is an AI-powered platform that helps users
            generate articles, create images, remove backgrounds,
            and review resumes in seconds.
          </p>

          <div className='flex items-center gap-4 mt-5'>

            {/* GitHub */}
            <a
              href='https://github.com/Sushumna09'
              target='_blank'
              rel='noreferrer'
              aria-label='GitHub'
              className='hover:text-gray-800 transition'
            >
              <svg
                className='w-6 h-6'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.03c-3.2.69-3.88-1.54-3.88-1.54-.53-1.34-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.52-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.3 1.18-3.11-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.19a11.1 11.1 0 015.79 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.58.24 2.75.12 3.04.73.81 1.18 1.85 1.18 3.11 0 4.42-2.69 5.39-5.26 5.68.41.35.78 1.04.78 2.11v3.12c0 .31.21.68.8.56A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z' />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href='https://linkedin.com/in/sushumna-devi-gajarla'
              target='_blank'
              rel='noreferrer'
              aria-label='LinkedIn'
              className='hover:text-blue-700 transition'
            >
              <svg
                className='w-6 h-6'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98h.02c1.1 0 1.98-.88 1.98-1.98C6.98 4.38 6.1 3.5 4.98 3.5zM3 8.75h3.96V21H3V8.75zm6.25 0h3.8v1.68h.05c.53-.98 1.82-2.02 3.75-2.02 4.01 0 4.75 2.64 4.75 6.07V21H17v-5.63c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.98V21H9.25V8.75z' />
              </svg>
            </a>
          </div>
        </div>

        {/* Products */}
        <div>
          <p className='text-lg text-gray-800 font-medium'>
            PRODUCTS
          </p>

          <ul className='mt-3 flex flex-col gap-2 text-sm'>
            <li>AI Article Writer</li>
            <li>Image Generator</li>
            <li>Background Remover</li>
            <li>Resume Reviewer</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <p className='text-lg text-gray-800 font-medium'>
            RESOURCES
          </p>

          <ul className='mt-3 flex flex-col gap-2 text-sm'>
            <li>Documentation</li>
            <li>FAQs</li>
            <li>Contact</li>
            <li>Feedback</li>
          </ul>
        </div>

        {/* Connect */}
        <div className='max-w-80'>
          <p className='text-lg text-gray-800 font-medium'>
            CONNECT
          </p>

          <p className='mt-3 text-sm'>
            Connect with me and explore the project.
          </p>

          <div className='mt-4 flex flex-col gap-2 text-sm'>
            <a
              href='https://github.com/Sushumna09'
              target='_blank'
              rel='noreferrer'
              className='hover:text-primary transition'
            >
              GitHub
            </a>

            <a
              href='https://linkedin.com/in/sushumna-devi-gajarla

'
              target='_blank'
              rel='noreferrer'
              className='hover:text-primary transition'
            >
              LinkedIn
            </a>

            <a
              href='mailto:your-email@gmail.com'
              className='hover:text-primary transition'
            >
              Email
            </a>
          </div>
        </div>

      </div>

      <hr className='border-gray-300 mt-8' />

      <div className='flex flex-col md:flex-row gap-3 items-center justify-between py-5 text-sm'>

        <p>
          © {new Date().getFullYear()} QuickAI |
          Built by Sushumna Gajarla
        </p>

        <p className='text-center'>
          Built with React, Tailwind CSS, Clerk, Node.js & AI APIs
        </p>

      </div>
    </div>
  )
}

export default Footer