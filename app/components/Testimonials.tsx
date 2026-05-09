'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Product Manager at TechCorp",
        content: "Vysyakh is an exceptional engineer who brings both technical expertise and creative problem-solving to every project. His ability to translate complex requirements into elegant user interfaces is truly impressive.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
        name: "Michael Chen",
        role: "Senior Developer at StartupX",
        content: "Working with Vysyakh was a pleasure. He writes clean, maintainable code and is always willing to go the extra mile to ensure the best possible user experience. A true asset to any team.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
        name: "Emily Davis",
        role: "UX Designer at CreativeStudio",
        content: "I've never met a developer who cares as much about design details as Vysyakh does. He perfectly implemented our designs and even suggested improvements that made the final product better.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    }
]

const Testimonials = () => {
    return (
        <section id="testimonials" className="py-32 relative overflow-hidden bg-white/5">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        Client <span className="text-gradient-gold italic">Stories</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        What people say about working with me.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel p-8 rounded-2xl border border-white/10 relative group hover:border-accent-gold/30 transition-colors"
                        >
                            <Quote className="absolute top-8 right-8 text-accent-gold/20 w-12 h-12 group-hover:text-accent-gold/40 transition-colors" />

                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-accent-gold/50">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-bold text-foreground">{testimonial.name}</div>
                                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                                </div>
                            </div>

                            <p className="text-muted-foreground leading-relaxed italic">
                                &quot;{testimonial.content}&quot;
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
