"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What are your service times?",
    answer: "Our main Sunday service is from 8:30 AM to 12:00 PM (WAT). We also have Tuesday Bible study at 5:00 PM (WAT). All services include both in-person and online options."
  },
  {
    question: "Do I need to be a member to attend services?",
    answer: "Absolutely not! Everyone is welcome to attend our services regardless of background or denomination. We believe in creating an inclusive environment where all can experience God's love."
  },
  {
    question: "How can I become a member?",
    answer: "To become a member, attend our membership classes which are held monthly. Contact our secretariat or speak with any of our leaders after service for enrollment information."
  },
  {
    question: "What should I expect during my first visit?",
    answer: "Expect a warm welcome! Our services include worship songs, prayer, Bible teaching, and fellowship. Dress comfortably - we don't have a strict dress code. Our ushers will help you find a seat and answer any questions."
  },
  {
    question: "Do you have programs for children and youth?",
    answer: "Yes! We have active Children's Ministry, Teen and Youth Ministry, and various age-appropriate programs. Children are welcome in the main service or can participate in our specialized children's programs."
  },
  {
    question: "How can I get involved in ministry?",
    answer: "We have many ministries including Music, Evangelism, Ushering, Media, and more. Speak with any ministry leader or contact our office to learn about volunteer opportunities that match your interests and gifts."
  },
  {
    question: "Do you offer prayer and counseling services?",
    answer: "Yes, we offer prayer sessions and pastoral counseling. You can submit prayer requests online, approach our prayer ministry team, or schedule a meeting with our pastoral staff for counseling."
  },
  {
    question: "How can I support the church financially?",
    answer: "We appreciate any support through tithes and offerings. You can give during service, through bank transfers, or online giving platforms. Contact our financial secretary for account details."
  },
  {
    question: "What is your statement of faith?",
    answer: "We believe in the Trinity, salvation by grace through faith in Jesus Christ, the authority of Scripture, and the power of the Holy Spirit. Our full statement of faith is available upon request."
  },
  {
    question: "Do you have online services?",
    answer: "Yes! You can join us live on our Facebook group or access recorded services. We also provide live audio streaming for those who prefer to listen only."
  }
];

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-900">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-6">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4 text-primary dark:text-secondary">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about our church family, services, and how to get involved.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                        {item.question}
                      </h3>
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  {openItems.includes(index) && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact for More Questions */}
          <div className="mt-12 text-center">
            <div className="relative rounded-xl overflow-hidden">
              {/* Background Image with Blur */}
              <div className="absolute inset-0 z-0">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-60 blur-sm"
                  style={{
                    backgroundImage: `url(/images/background/faq_background.jpg)`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat"
                  }}
                />
                {/* Enhanced overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/70 z-1" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/40 to-primary/60 z-1" />
              </div>

              <div className="relative z-10 p-8 text-white">
                <h3 className="text-xl font-semibold mb-4 drop-shadow-lg">
                  Still have questions?
                </h3>
                <p className="text-white mb-6 drop-shadow-md">
                  We're here to help! Reach out to us and we'll be happy to answer any additional questions you might have.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-full font-semibold hover:from-primary/90 hover:to-primary transition-all duration-200 drop-shadow-lg"
                  >
                    Contact Us
                  </a>
                  <a
                    href="mailto:info@prevailingword.org"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-full font-semibold hover:from-primary/90 hover:to-primary transition-all duration-200 drop-shadow-lg"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
