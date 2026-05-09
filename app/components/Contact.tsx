'use client'

import { useState, useRef } from 'react';
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from "react-icons/fa6";
import { Send, User, Mail, MessageSquare } from 'lucide-react'
import { handleSubmit } from '@/app/actions'
import { IconType } from 'react-icons';

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: IconType }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-accent-gold/20 hover:border-accent-gold/50 hover:text-accent-gold transition-all"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <Icon className="w-5 h-5" />
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
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Let&apos;s Create Something <span className="text-gradient-gold italic">Extraordinary</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
              Whether you have a project in mind, want to discuss the latest tech trends, or just want to say hello, I&apos;m always open to new conversations.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-foreground">Connect with me</h3>
                <div className="flex gap-4">
                  <SocialIcon href="https://linkedin.com/in/vysyakh-ajith" icon={FaLinkedin} />
                  <SocialIcon href="https://x.com/whyshagajith" icon={FaXTwitter} />
                  <SocialIcon href="https://github.com/vkajith" icon={FaGithub} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10"
          >
            <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Your Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent-gold/50 transition-colors"
                  />
                </div>
                {formErrors.name && (
                  <p className="text-xs text-red-400 ml-1">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent-gold/50 transition-colors"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-xs text-red-400 ml-1">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                  <textarea
                    name="message"
                    placeholder="Tell me about your project..."
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent-gold/50 transition-colors resize-none"
                  />
                </div>
                {formErrors.message && (
                  <p className="text-xs text-red-400 ml-1">{formErrors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-foreground text-background font-bold py-4 rounded-xl hover:bg-accent-gold hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-center text-sm font-medium"
                >
                  Message sent successfully! I&apos;ll get back to you soon.
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
