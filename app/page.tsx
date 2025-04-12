"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Quizly - Fun Learning Platform</title>
        <meta name="description" content="Test your knowledge with interactive quizzes" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-indigo-100 opacity-20"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
              }}
              animate={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                transition: {
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
            />
          ))}
        </div>

        <main className="relative container mx-auto px-4 py-16 z-10">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                🚀 New Features Added!
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Smarter</span>,<br />
              Not Harder with <span className="text-blue-600">Quizly</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              The most engaging way to master any subject through interactive quizzes, challenges, and progress tracking.
            </motion.p>
            
            <motion.div
              className="flex gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="px-8 py-6 text-lg gap-2 shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => router.push("/signin")}
                >
                  <GoogleIcon />
                  Get Started - It's Free
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-6 text-lg border-2"
                >
                  See How It Works
                </Button>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Features Grid */}
          <motion.section 
            className="grid md:grid-cols-3 gap-8 mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
              key={feature.title}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                delay: 0.2 + index * 0.1
              }}
            >
                <div className="text-blue-600 mb-4 text-3xl">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.section>

          {/* Testimonials */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Loved by Thousands</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                        {testimonial.emoji}
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Learning?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who are learning smarter with Quizly.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
                onClick={() => router.push("/signin")}
              >
                Start Learning Now
              </Button>
            </motion.div>
          </motion.section>
        </main>

        <footer className="bg-white py-8 border-t relative z-10">
          <div className="container mx-auto px-4 text-center text-gray-500">
            © {new Date().getFullYear()} Quizly. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}

// Components
function GoogleIcon() {
  return (
    <svg 
      className="h-5 w-5" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// Data
const features = [
  {
    icon: "🧠",
    title: "Smart Quizzes",
    description: "Adaptive learning that focuses on your weak areas"
  },
  {
    icon: "⚡",
    title: "Quick Challenges",
    description: "Bite-sized quizzes for when you're short on time"
  },
  {
    icon: "📈",
    title: "Progress Tracking",
    description: "Visualize your improvement over time"
  }
];

const testimonials = [
  {
    emoji: "👩‍🏫",
    name: "Sarah Johnson",
    role: "High School Teacher",
    quote: "My students' engagement has doubled since we started using Quizly for test prep."
  },
  {
    emoji: "👨‍💻",
    name: "Michael Chen",
    role: "Software Engineer",
    quote: "I use Quizly daily to keep my technical knowledge sharp. Beats reading documentation!"
  }
];