'use client'

import { useState, useRef } from 'react';
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from "react-icons/fa6";
import { FiUser, FiMail, FiMessageSquare } from 'react-icons/fi'
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
    <section id="contact" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            <span className="gradient-text">Drop a message</span>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">I’d love to hear from you — say hello, share ideas, or collaborate.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Socials / Short bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass rounded-xl p-8 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Let’s connect</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Prefer socials? I’m active here:</p>
            <div className="mt-6 flex gap-6">
              <SocialIcon href="https://linkedin.com/in/vysyakh-ajith" icon={FaLinkedin} />
              <SocialIcon href="https://x.com/whyshagajith" icon={FaXTwitter} />
              <SocialIcon href="https://github.com/vkajith" icon={FaGithub} />
            </div>
            <div className="mt-8 h-px w-full bg-gradient-to-r from-accent-start/20 via-transparent to-accent-end/20" />
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">I typically respond within 24–48 hours.</p>
          </motion.div>

          {/* Right: Message form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
          >
            <form ref={formRef} onSubmit={onSubmit} className="p-8 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your name</label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${formErrors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}> 
                  <FiUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Jane Doe"
                    required
                    className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>
                {formErrors.name && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm text-red-500 dark:text-red-400">
                    {formErrors.name}
                  </motion.p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email address</label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${formErrors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}> 
                  <FiMail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="jane@doe.com"
                    required
                    className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>
                {formErrors.email && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm text-red-500 dark:text-red-400">
                    {formErrors.email}
                  </motion.p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your message</label>
                <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${formErrors.message ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}> 
                  <FiMessageSquare className="mt-1 w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <textarea
                    name="message"
                    placeholder="Say hi, share feedback, or propose a collaboration…"
                    required
                    rows={6}
                    className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
                  />
                </div>
                {formErrors.message && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm text-red-500 dark:text-red-400">
                    {formErrors.message}
                  </motion.p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Send message'
                )}
              </motion.button>

              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 p-4 border border-green-300/50 dark:border-green-700/50 rounded-lg bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-100"
                >
                  Thank you for your message! I’ll get back to you soon.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
