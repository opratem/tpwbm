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
    <section className="mobile-section-spacing bg-gray-50 dark:bg-slate-900">
      <div className="container mobile-container mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-secondary/20 rounded-full mb-4 sm:mb-5 md:mb-6">
              <HelpCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            </div>
            <h2 className="mobile-text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-3 sm:mb-4 px-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary mx-auto mb-3 sm:mb-4"></div>
            <p className="mobile-text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Find answers to common questions about our church family, services, and how to get involved.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3 sm:space-y-4">
            {faqData.map((item, index) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 mobile-card">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full text-left p-3 sm:p-4 md:p-5 lg:p-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg mobile-touch-target"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="mobile-text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-white pr-2">
                        {item.question}
                      </h3>
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  {openItems.includes(index) && (
                    <div className="px-3 sm:px-4 md:px-5 lg:px-6 pb-3 sm:pb-4 md:pb-5 lg:pb-6">
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mobile-text-xs md:text-sm lg:text-base">
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
          <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-center">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden">
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

              <div className="relative z-10 p-4 sm:p-6 md:p-8 text-white">
                <h3 className="mobile-text-base md:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 drop-shadow-lg">
                  Still have questions?
                </h3>
                <p className="text-white mb-4 sm:mb-5 md:mb-6 drop-shadow-md mobile-text-sm md:text-base px-4 sm:px-0">
                  We're here to help! Reach out to us and we'll be happy to answer any additional questions you might have.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-full font-semibold hover:from-primary/90 hover:to-primary transition-all duration-200 drop-shadow-lg mobile-text-sm md:text-base mobile-touch-target"
                  >
                    Contact Us
                  </a>
                  <a
                    href="mailto:info@prevailingword.org"
                    className="inline-flex items-center justify-center px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-full font-semibold hover:from-primary/90 hover:to-primary transition-all duration-200 drop-shadow-lg mobile-text-sm md:text-base mobile-touch-target"
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
