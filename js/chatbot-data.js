/**
 * Zeph Chatbot Knowledge Base
 * Pre-written Q&A pairs with weighted keyword matching
 */
var ZephChatbotData = (function () {
  'use strict';

  var entries = [
    // ===== Greetings & Meta =====
    {
      id: 'greeting',
      keywords: [
        { words: ['hello', 'hi', 'hey', 'howdy', 'greetings', 'sup'], weight: 3 },
        { words: ['good morning', 'good afternoon', 'good evening'], weight: 3 }
      ],
      answer: "Hi there! I'm the Zeph Assistant. I can help you learn about our smart breath trainer, respiratory health topics, or customer support. What can I help you with?",
      quickReplies: ['What is Zeph?', 'How does it work?', 'Pricing']
    },
    {
      id: 'thanks',
      keywords: [
        { words: ['thanks', 'thank you', 'thx', 'appreciate', 'ty'], weight: 3 },
        { words: ['helpful', 'great', 'awesome', 'perfect'], weight: 1 }
      ],
      answer: "You're welcome! Is there anything else I can help you with?",
      quickReplies: ['Product info', 'Health topics', 'Contact support']
    },
    {
      id: 'bye',
      keywords: [
        { words: ['bye', 'goodbye', 'see you', 'later', 'take care'], weight: 3 }
      ],
      answer: "Goodbye! Feel free to come back anytime you have questions. Breathe well! 🌿"
    },

    // ===== Product Info =====
    {
      id: 'what-is-zeph',
      keywords: [
        { words: ['what is zeph', 'what\'s zeph', 'tell me about zeph', 'about zeph'], weight: 5 },
        { words: ['what', 'zeph'], weight: 2 },
        { words: ['product', 'device', 'trainer', 'breath trainer'], weight: 2 }
      ],
      answer: "Zeph is a smart breath trainer that combines clinical-grade respiratory sensors with an intuitive design. You breathe into the device and receive real-time feedback on your lung function, breathing patterns, and personalized exercise guidance — all synced wirelessly to the Zeph app. It's designed for patients managing respiratory conditions, athletes looking to optimize performance, and anyone wanting to improve their breathing health.",
      quickReplies: ['How does it work?', 'What\'s included?', 'Pricing']
    },
    {
      id: 'how-it-works',
      keywords: [
        { words: ['how does it work', 'how it works', 'how does zeph work'], weight: 5 },
        { words: ['how', 'work', 'works', 'use'], weight: 2 },
        { words: ['function', 'operate', 'mechanism'], weight: 2 }
      ],
      answer: "Using Zeph is simple: breathe into the device as directed by the app, and clinical-grade sensors capture precise lung function data in real time. The data syncs wirelessly to the Zeph app, where you can track your breathability score, follow guided exercises designed by respiratory specialists, and monitor your progress over weeks and months. We recommend 2–3 sessions per day, each lasting about 5–10 minutes.",
      quickReplies: ['Setup guide', 'App features', 'Device specs']
    },
    {
      id: 'device-features',
      keywords: [
        { words: ['features', 'specs', 'specifications', 'device specs'], weight: 4 },
        { words: ['sensor', 'sensors', 'clinical grade', 'medical grade'], weight: 3 },
        { words: ['lightweight', 'portable', 'compact', 'design'], weight: 2 }
      ],
      answer: "The Zeph trainer features:\n\n• **Clinical-grade sensors** — Medical-precision sensors for accurate lung function measurement\n• **Long-lasting battery** — Rechargeable, designed for weeks of daily use, charges via USB-C in under 2 hours\n• **Wireless connectivity** — Seamless sync with the Zeph app on iOS and Android\n• **Ultra-lightweight design** — Compact and portable, take it anywhere",
      quickReplies: ['What\'s included?', 'Battery life', 'App features']
    },
    {
      id: 'whats-included',
      keywords: [
        { words: ['what\'s included', 'whats included', 'in the box', 'comes with', 'package'], weight: 5 },
        { words: ['included', 'box', 'kit', 'bundle', 'accessories'], weight: 3 }
      ],
      answer: "Every Zeph kit includes:\n\n• **Zeph Trainer Device** — With clinical-grade sensors and rechargeable battery\n• **USB-C Charging Cable** — Full charge in under 2 hours\n• **Carrying Case** — Compact and protective for on-the-go use\n• **Quick Start Guide** — Illustrated setup instructions\n• **1-Year App Subscription** — Full access to guided exercises, progress tracking, and personalized insights",
      quickReplies: ['Pricing', 'How to set up', 'App features']
    },
    {
      id: 'app-features',
      keywords: [
        { words: ['app', 'application', 'mobile app', 'zeph app'], weight: 4 },
        { words: ['dashboard', 'tracking', 'insights', 'breathability score'], weight: 3 },
        { words: ['guided exercises', 'exercise', 'progress'], weight: 2 }
      ],
      answer: "The Zeph app is your personal breathing dashboard. Key features include:\n\n• **Breathability Score** — A clear metric tracking your overall respiratory health\n• **Guided Exercises** — Personalized breathing routines designed by respiratory specialists\n• **Progress Tracking** — Monitor your improvements over weeks and months\n• **Clinical Reports** — Export reports to share with your healthcare provider\n• **Smart Reminders** — Stay consistent with customizable session reminders\n\nAvailable on both iOS and Android.",
      quickReplies: ['Compatibility', 'Share with doctor', 'How it works']
    },
    {
      id: 'battery',
      keywords: [
        { words: ['battery', 'battery life', 'charge', 'charging', 'how long'], weight: 4 },
        { words: ['usb', 'usb-c', 'power', 'recharge', 'rechargeable'], weight: 3 }
      ],
      answer: "The Zeph trainer has a long-lasting rechargeable battery designed for weeks of daily use. It charges via USB-C, and a full charge takes under 2 hours. The app will notify you when it's time to recharge.",
      quickReplies: ['Device features', 'How to set up', 'What\'s included?']
    },
    {
      id: 'compatibility',
      keywords: [
        { words: ['compatible', 'compatibility', 'iphone', 'android', 'ios'], weight: 4 },
        { words: ['phone', 'tablet', 'device', 'supported'], weight: 2 },
        { words: ['bluetooth', 'wireless', 'connect', 'sync'], weight: 2 }
      ],
      answer: "The Zeph app is available on both iOS and Android devices. The trainer connects to your phone or tablet via Bluetooth for seamless, real-time data syncing.",
      quickReplies: ['App features', 'Setup guide', 'Troubleshooting']
    },

    // ===== Setup & Troubleshooting =====
    {
      id: 'setup',
      keywords: [
        { words: ['set up', 'setup', 'getting started', 'start', 'install'], weight: 4 },
        { words: ['pair', 'pairing', 'connect', 'first time'], weight: 3 },
        { words: ['how to', 'guide', 'instructions'], weight: 1 }
      ],
      answer: "Getting started with Zeph is easy:\n\n1. **Download** the Zeph app from the App Store or Google Play\n2. **Turn on** the trainer by pressing the power button for 2 seconds\n3. **Open** the app and follow the on-screen pairing instructions\n4. The device connects via Bluetooth automatically\n5. **Start breathing** — the app will guide your first session!",
      quickReplies: ['Troubleshooting', 'How often to use', 'App features']
    },
    {
      id: 'troubleshooting',
      keywords: [
        { words: ['troubleshoot', 'troubleshooting', 'not working', 'won\'t connect', 'problem'], weight: 5 },
        { words: ['issue', 'error', 'fix', 'broken', 'help'], weight: 2 },
        { words: ['bluetooth', 'connection', 'disconnect', 'can\'t connect'], weight: 3 }
      ],
      answer: "If your Zeph trainer won't connect:\n\n1. Make sure **Bluetooth is enabled** on your phone or tablet\n2. **Restart** both the Zeph trainer and the app\n3. Try **removing the device** from your Bluetooth settings and re-pairing\n4. Ensure the app is **updated** to the latest version\n\nIf the issue persists, contact our support team at **support@zeph.com**.",
      quickReplies: ['Contact support', 'Setup guide', 'Cleaning']
    },
    {
      id: 'cleaning',
      keywords: [
        { words: ['clean', 'cleaning', 'wash', 'maintain', 'maintenance'], weight: 4 },
        { words: ['mouthpiece', 'hygiene', 'sanitize', 'disinfect'], weight: 3 },
        { words: ['replace', 'replacement'], weight: 2 }
      ],
      answer: "To keep your Zeph trainer in top shape:\n\n• **After each use:** Wipe the mouthpiece with a soft, damp cloth\n• **Weekly:** Do a thorough cleaning of the mouthpiece\n• **The mouthpiece** is detachable and can be rinsed under warm water\n• **Do not** submerge the main device in water\n• **Replace** the mouthpiece every 3 months for optimal hygiene",
      quickReplies: ['What\'s included?', 'Device features', 'Contact support']
    },
    {
      id: 'how-often',
      keywords: [
        { words: ['how often', 'frequency', 'how many times', 'daily'], weight: 4 },
        { words: ['session', 'sessions', 'routine', 'schedule'], weight: 3 },
        { words: ['recommend', 'suggested', 'best practice'], weight: 2 }
      ],
      answer: "We recommend **2–3 sessions per day**, each lasting about **5–10 minutes**. The app will guide you with reminders and personalized session plans. Consistency is key — most users see improvements within 2–4 weeks of regular use.",
      quickReplies: ['How it works', 'App features', 'Health benefits']
    },

    // ===== Customer Support =====
    {
      id: 'pricing',
      keywords: [
        { words: ['price', 'pricing', 'cost', 'how much', 'buy', 'purchase'], weight: 5 },
        { words: ['order', 'store', 'shop', 'subscription'], weight: 3 },
        { words: ['money', 'afford', 'expensive', 'cheap', 'value'], weight: 2 }
      ],
      answer: "Zeph is currently available for pre-order. The kit includes the trainer device, USB-C cable, carrying case, quick start guide, and a 1-year app subscription. For current pricing and availability, please contact us directly — we'd love to help!",
      quickReplies: ['Contact us', 'What\'s included?', 'Shipping']
    },
    {
      id: 'shipping',
      keywords: [
        { words: ['shipping', 'delivery', 'ship', 'deliver'], weight: 4 },
        { words: ['when', 'arrive', 'long', 'timeline', 'eta'], weight: 2 },
        { words: ['international', 'worldwide', 'country', 'location'], weight: 2 }
      ],
      answer: "For shipping information, estimated delivery timelines, and availability in your area, please reach out to our team. We're working to make Zeph available as widely as possible!",
      quickReplies: ['Contact us', 'Pricing', 'Returns']
    },
    {
      id: 'returns',
      keywords: [
        { words: ['return', 'returns', 'refund', 'money back', 'exchange'], weight: 5 },
        { words: ['warranty', 'guarantee', 'policy'], weight: 3 },
        { words: ['cancel', 'cancellation'], weight: 2 }
      ],
      answer: "We want you to be completely satisfied with your Zeph trainer. For details about our return policy, warranty, and satisfaction guarantee, please contact our support team at **support@zeph.com** or visit our Help Center.",
      quickReplies: ['Contact support', 'Help Center', 'Warranty']
    },
    {
      id: 'contact',
      keywords: [
        { words: ['contact', 'reach', 'email', 'phone', 'call'], weight: 4 },
        { words: ['support', 'customer service', 'help', 'talk to someone'], weight: 3 },
        { words: ['human', 'agent', 'person', 'representative'], weight: 3 }
      ],
      answer: "You can reach our team in several ways:\n\n• **Email:** support@zeph.com (we respond within 24 hours)\n• **Phone:** (555) 123-4567\n• **Contact form:** Visit our [Contact page](index.html#contact)\n\nOur support team is happy to help with any questions!",
      quickReplies: ['Help Center', 'Troubleshooting', 'Returns']
    },
    {
      id: 'hipaa',
      keywords: [
        { words: ['hipaa', 'privacy', 'data privacy', 'data security'], weight: 5 },
        { words: ['secure', 'security', 'protected', 'encryption'], weight: 3 },
        { words: ['compliant', 'compliance', 'regulation', 'phi'], weight: 3 }
      ],
      answer: "Zeph takes data privacy very seriously. We are fully **HIPAA-compliant**, meaning your personal health information is protected with industry-leading security measures. Your data is encrypted both in transit and at rest. For full details, visit our [HIPAA Compliance page](hipaa.html) and [Privacy Policy](privacy.html).",
      quickReplies: ['Privacy policy', 'Share with doctor', 'Contact support']
    },

    // ===== Clinicians & Providers =====
    {
      id: 'clinicians',
      keywords: [
        { words: ['clinician', 'clinicians', 'doctor', 'physician', 'provider'], weight: 4 },
        { words: ['healthcare', 'medical', 'practice', 'clinic'], weight: 3 },
        { words: ['remote monitoring', 'patient monitoring', 'dashboard'], weight: 3 }
      ],
      answer: "Zeph offers a dedicated clinician platform for healthcare providers. The clinician dashboard enables **remote patient monitoring**, provides clinical-grade respiratory data, and supports data-driven care decisions between office visits. Visit our [Clinicians page](clinicians.html) to learn more about partnering with Zeph.",
      quickReplies: ['Share with doctor', 'HIPAA', 'Contact us']
    },
    {
      id: 'share-with-doctor',
      keywords: [
        { words: ['share', 'doctor', 'report', 'export'], weight: 3 },
        { words: ['data sharing', 'clinical report', 'provider'], weight: 3 },
        { words: ['send', 'results', 'care team'], weight: 2 }
      ],
      answer: "Yes! The Zeph app lets you **export clinical-grade respiratory reports** to share with your healthcare provider. Your doctor can also use the Zeph clinician dashboard for remote monitoring if their practice is a Zeph partner. This helps enable more informed care decisions between office visits.",
      quickReplies: ['Clinician info', 'App features', 'HIPAA']
    },

    // ===== Health Topics =====
    {
      id: 'copd',
      keywords: [
        { words: ['copd', 'chronic obstructive', 'emphysema'], weight: 5 },
        { words: ['chronic', 'lung disease', 'obstructive'], weight: 3 }
      ],
      answer: "COPD (Chronic Obstructive Pulmonary Disease) affects millions worldwide. Zeph can help COPD patients by providing **daily respiratory monitoring**, guided breathing exercises to strengthen lung function, and clinical-grade data to share with their care team. Regular use helps patients track their condition and catch changes early.\n\nRead more in our blog: [COPD Daily Monitoring](blog/copd-daily-monitoring.html)",
      quickReplies: ['Breathing exercises', 'Share with doctor', 'How it works']
    },
    {
      id: 'asthma',
      keywords: [
        { words: ['asthma', 'asthmatic', 'wheeze', 'wheezing'], weight: 5 },
        { words: ['inhaler', 'bronchial', 'airways'], weight: 3 },
        { words: ['trigger', 'attack', 'flare'], weight: 2 }
      ],
      answer: "Zeph is a valuable tool for asthma management. It helps you **monitor your lung function daily**, track patterns over time, and identify potential triggers before they lead to flare-ups. The guided breathing exercises can also help strengthen respiratory muscles and improve breathing control. Always continue to follow your doctor's treatment plan alongside using Zeph.",
      quickReplies: ['Breathing exercises', 'Air quality', 'How it works']
    },
    {
      id: 'breathing-exercises',
      keywords: [
        { words: ['breathing exercise', 'breathing exercises', 'breathe', 'exercise'], weight: 4 },
        { words: ['diaphragm', 'diaphragmatic', 'belly breathing'], weight: 3 },
        { words: ['pursed lip', 'box breathing', 'technique', 'practice'], weight: 3 }
      ],
      answer: "Breathing exercises are at the core of the Zeph experience. The app guides you through evidence-based techniques like **diaphragmatic breathing**, **pursed lip breathing**, and more. Each exercise is designed by respiratory specialists and personalized to your level.\n\nWant to try some on your own? Check out our guide: [5 Breathing Exercises You Can Do Anywhere](blog/breathing-exercises.html)",
      quickReplies: ['How often to use', 'Lung capacity', 'App features']
    },
    {
      id: 'lung-capacity',
      keywords: [
        { words: ['lung capacity', 'lung function', 'lung health', 'lungs'], weight: 4 },
        { words: ['fev1', 'fvc', 'spirometry', 'peak flow'], weight: 4 },
        { words: ['capacity', 'volume', 'improve lungs'], weight: 3 }
      ],
      answer: "Lung capacity refers to the total amount of air your lungs can hold. Zeph measures key metrics to assess your lung function and tracks changes over time. Consistent use of guided breathing exercises can help **maintain and improve** your respiratory capacity.\n\nLearn more: [Understanding Lung Capacity](blog/understanding-lung-capacity.html)",
      quickReplies: ['Breathing exercises', 'Device features', 'COPD info']
    },
    {
      id: 'air-quality',
      keywords: [
        { words: ['air quality', 'pollution', 'air pollution', 'outdoor air'], weight: 5 },
        { words: ['environment', 'allergen', 'allergens', 'smoke'], weight: 3 },
        { words: ['indoors', 'outdoors', 'pollutant', 'smog'], weight: 2 }
      ],
      answer: "Air quality significantly impacts respiratory health. Poor air quality can worsen conditions like asthma and COPD, and affect everyone's breathing comfort. Zeph helps you monitor your lung function so you can understand how air quality changes affect you personally.\n\nRead more: [Air Quality & Respiratory Health](blog/air-quality-respiratory-health.html)",
      quickReplies: ['Asthma info', 'COPD info', 'Breathing exercises']
    },
    {
      id: 'mental-health',
      keywords: [
        { words: ['mental health', 'stress', 'anxiety', 'calm'], weight: 4 },
        { words: ['relaxation', 'meditation', 'mindfulness', 'wellness'], weight: 3 },
        { words: ['sleep', 'mood', 'focus', 'concentrate'], weight: 2 }
      ],
      answer: "Breathing and mental health are deeply connected. Controlled breathing techniques can help **reduce stress and anxiety**, improve focus, and promote better sleep. The Zeph app includes guided exercises specifically designed for relaxation and mental wellness.\n\nExplore the connection: [Breathing & Mental Health](blog/breathing-and-mental-health.html)",
      quickReplies: ['Breathing exercises', 'App features', 'How it works']
    },
    {
      id: 'athletes',
      keywords: [
        { words: ['athlete', 'athletes', 'athletic', 'sport', 'sports'], weight: 4 },
        { words: ['performance', 'endurance', 'stamina', 'training'], weight: 3 },
        { words: ['fitness', 'running', 'cycling', 'swimming', 'vo2'], weight: 3 }
      ],
      answer: "Athletes can use Zeph to gain a competitive edge through optimized breathing. Breath training can improve **endurance, oxygen efficiency, and recovery**. The Zeph app offers exercises tailored for athletic performance, helping you push your limits and breathe more efficiently during competition.\n\nLearn more: [Athletes & Breath Training](blog/athletes-breath-training.html)",
      quickReplies: ['How it works', 'Breathing exercises', 'Device features']
    },
    {
      id: 'wellness',
      keywords: [
        { words: ['wellness', 'well-being', 'health', 'healthy'], weight: 3 },
        { words: ['benefit', 'benefits', 'improve', 'better breathing'], weight: 3 },
        { words: ['gut health', 'brain health', 'immune', 'overall health'], weight: 3 }
      ],
      answer: "Better breathing impacts far more than just your lungs. Research shows that improved breathing can benefit **brain health, gut health, immune function, cardiovascular health**, and overall well-being. Zeph gives you the tools to breathe better every day — from clinical-grade monitoring to personalized guided exercises.",
      quickReplies: ['Breathing exercises', 'Mental health', 'Athletes']
    },

    // ===== Navigation =====
    {
      id: 'science',
      keywords: [
        { words: ['science', 'research', 'studies', 'clinical', 'evidence'], weight: 4 },
        { words: ['proof', 'data', 'peer reviewed', 'published'], weight: 3 }
      ],
      answer: "Zeph is built on a foundation of respiratory science and clinical research. Our technology is informed by peer-reviewed studies and developed in collaboration with respiratory specialists. Visit our [Science page](science.html) to explore the research behind Zeph.",
      quickReplies: ['How it works', 'Clinician info', 'Device features']
    },
    {
      id: 'blog',
      keywords: [
        { words: ['blog', 'articles', 'read', 'resources', 'learn'], weight: 4 },
        { words: ['content', 'education', 'information', 'tips'], weight: 2 }
      ],
      answer: "Check out our blog for in-depth articles on respiratory health, breathing techniques, and wellness:\n\n• [5 Breathing Exercises You Can Do Anywhere](blog/breathing-exercises.html)\n• [COPD Daily Monitoring](blog/copd-daily-monitoring.html)\n• [Understanding Lung Capacity](blog/understanding-lung-capacity.html)\n• [Athletes & Breath Training](blog/athletes-breath-training.html)\n• [Breathing & Mental Health](blog/breathing-and-mental-health.html)\n• [Air Quality & Respiratory Health](blog/air-quality-respiratory-health.html)\n\nVisit the full [Blog](blog.html) for more.",
      quickReplies: ['Breathing exercises', 'COPD info', 'Athletes']
    },
    {
      id: 'careers',
      keywords: [
        { words: ['career', 'careers', 'job', 'jobs', 'hiring', 'work at zeph'], weight: 5 },
        { words: ['employment', 'position', 'opening', 'join', 'team'], weight: 3 }
      ],
      answer: "Interested in joining the Zeph team? We're always looking for passionate people who want to make a difference in respiratory health. Visit our [Careers page](careers.html) to see current openings and learn about life at Zeph.",
      quickReplies: ['About Zeph', 'Contact us']
    },
    {
      id: 'about',
      keywords: [
        { words: ['about', 'company', 'who', 'team', 'mission'], weight: 3 },
        { words: ['founded', 'founder', 'story', 'history', 'vision'], weight: 3 }
      ],
      answer: "Zeph is on a mission to help everyone breathe better. Our team combines expertise in respiratory science, medical devices, and technology to create tools that make a real difference in people's lives. Learn more on our [About page](about.html).",
      quickReplies: ['Careers', 'Contact us', 'The science']
    },
    {
      id: 'help-center',
      keywords: [
        { words: ['help center', 'faq', 'frequently asked', 'support page'], weight: 5 },
        { words: ['help', 'question', 'answer'], weight: 1 }
      ],
      answer: "Our Help Center has answers to the most common questions about setting up, using, and maintaining your Zeph trainer. Visit the [Help Center](help.html) for FAQs, troubleshooting tips, and ways to get in touch with our support team.",
      quickReplies: ['Setup guide', 'Troubleshooting', 'Contact support']
    },
    {
      id: 'privacy',
      keywords: [
        { words: ['privacy', 'privacy policy', 'data collection', 'personal data'], weight: 4 },
        { words: ['cookies', 'tracking', 'information', 'gdpr'], weight: 3 }
      ],
      answer: "Your privacy matters to us. We collect only the data necessary to provide and improve the Zeph experience, and we never sell your personal information. For full details, read our [Privacy Policy](privacy.html).",
      quickReplies: ['HIPAA', 'Contact support', 'Data security']
    }
  ];

  var fallbackResponse = {
    answer: "I'm not sure I understood that. Could you try rephrasing your question? I can help with topics like the Zeph product, breathing exercises, respiratory health, pricing, setup, and support.",
    quickReplies: ['What is Zeph?', 'Breathing exercises', 'Contact support', 'Help Center']
  };

  var welcomeMessage = {
    answer: "Welcome! I'm the Zeph Assistant. How can I help you today?",
    quickReplies: ['What is Zeph?', 'How does it work?', 'Health topics', 'Contact support']
  };

  return {
    entries: entries,
    fallbackResponse: fallbackResponse,
    welcomeMessage: welcomeMessage
  };
})();
