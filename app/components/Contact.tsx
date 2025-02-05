'use client'

import { useState, useRef } from 'react';
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from "react-icons/fa6";
import { handleSubmit } from '@/app/actions'

import { IconType } from 'react-icons';

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: IconType }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <Icon className="w-8 h-8" />
  </motion.a>
)

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const validateForm = (formData: FormData) => {
    const errors = {
      name: '',
      email: '',
      message: ''
    };
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Please enter a valid email address';
    }
    if (message.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    return errors;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const errors = validateForm(formData);

    if (Object.values(errors).some(error => error !== '')) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      await handleSubmit(formData);
      if (formRef.current) {
        formRef.current.reset();
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      setFormErrors({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Let&apos;s Connect!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              If you&apos;d like to get in touch, feel free to connect with me via social media or send me a direct message here.
            </p>
            <div className="flex gap-6">
              <SocialIcon 
                href="https://linkedin.com/in/vysyakh-ajith" 
                icon={FaLinkedin}
              />
              <SocialIcon 
                href="https://x.com/whyshagajith" 
                icon={FaXTwitter}
              />
              <SocialIcon 
                href="https://github.com/vkajith" 
                icon={FaGithub}
              />
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-1">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${formErrors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-700'} 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                    placeholder:text-gray-500 dark:placeholder:text-gray-400
                    focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20
                    transition-colors duration-200 ease-in-out`}
                />
                {formErrors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 dark:text-red-400"
                  >
                    {formErrors.name}
                  </motion.p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${formErrors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-700'} 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                    placeholder:text-gray-500 dark:placeholder:text-gray-400
                    focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20
                    transition-colors duration-200 ease-in-out`}
                />
                {formErrors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 dark:text-red-400"
                  >
                    {formErrors.email}
                  </motion.p>
                )}
              </div>
              <div className="space-y-1">
                <textarea
                  name="message"
                  placeholder="Message"
                  required
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border ${formErrors.message ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-700'} 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                    placeholder:text-gray-500 dark:placeholder:text-gray-400
                    focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20
                    transition-colors duration-200 ease-in-out resize-none`}
                />
                {formErrors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 dark:text-red-400"
                  >
                    {formErrors.message}
                  </motion.p>
                )}
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 
                  rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'SEND MESSAGE'
                )}
              </motion.button>
            </form>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-lg text-center"
              >
                Thank you for your message! I&apos;ll get back to you soon.
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
