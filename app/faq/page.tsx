"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/custom/accordion';
import { NavigationHeader } from '@/components/layout/navigation-header';
import { Footer } from '@/components/layout/site-footer';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'ordering', label: 'Ordering & Payment' },
  { id: 'shipping', label: 'Shipping & Delivery' },
  { id: 'products', label: 'Products & Collections' },
  { id: 'returns', label: 'Returns & Refunds' },
  { id: 'care', label: 'Product Care' },
];

const faqData = {
    ordering: {
      title: "Ordering & Payment",
      items: [
        {
          question: "How can I place an order?",
          answer: "Browse our collection of natural and eco-friendly home decor, add items to your cart, and proceed to checkout. We offer secure payment through PayPal, which allows you to pay with credit cards (Visa, MasterCard, Maestro) or your PayPal account. All payments are protected by PayPal's buyer protection program."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept payments through PayPal, which includes options to pay with credit cards (Visa, MasterCard, Maestro) or your PayPal account. All transactions are secure and protected by PayPal's buyer protection program. For detailed payment information, visit: https://www.simpleinteriorideas.com/pages/payments"
        },
        {
          question: "How can I contact your customer support?",
          answer: "We offer multiple ways to reach us: Email us at info@simpleinteriorideas.com, or use our support forms in the website header for specific inquiries about Products, Shipping, or Refunds. Our support team is available Mon-Sun: 7am - 7pm (Latvia time)."
        },
        {
          question: "Are your products handcrafted?",
          answer: "Yes! We focus on handcrafted quality products made from natural, eco-friendly materials. Our collection emphasizes comfortable and cozy living while maintaining high standards of craftsmanship."
        },
        {
          question: "Can I cancel or modify my order?",
          answer: "Please contact us immediately at info@simpleinteriorideas.com if you need to cancel or modify your order. We'll do our best to accommodate changes before the order enters processing (within 24 hours of placement)."
        },
        {
          question: "Do you offer gift wrapping?",
          answer: "While we don't currently offer gift wrapping, our upcoming 'Craft Your Gift' service will include special packaging options. All items are carefully packaged in eco-friendly materials suitable for gifting."
        },
        {
          question: "Can I purchase multiple items?",
          answer: "Yes! There's no limit on order quantities. All orders, regardless of size, qualify for free worldwide shipping. For bulk orders or special requests, please contact our support team."
        },
        {
          question: "Is my payment information secure?",
          answer: "Absolutely! All payments are processed through PayPal's secure platform, which offers state-of-the-art encryption and fraud prevention. Your financial information is never stored on our servers."
        },
        {
          question: "Do you offer interior design consultation?",
          answer: "While we don't currently offer formal design services, our support team is happy to provide product recommendations and help you coordinate pieces from our collections. Email us your questions at info@simpleinteriorideas.com"
        }
      ]
    },
    shipping: {
      title: "Shipping & Delivery",
      items: [
        {
          question: "What are your shipping rates?",
          answer: "We offer FREE worldwide shipping on all orders! This applies to our entire collection of over 300 products, regardless of order size or destination."
        },
        {
          question: "How long will it take to receive my order?",
          answer: "Standard delivery time is approximately 30 days plus 3-5 days processing time. This timeline applies to all international orders. We process each order carefully to ensure quality packaging and safe delivery."
        },
        {
          question: "How can I track my order?",
          answer: "You can easily track your order through our website. The tracking feature is available in the site header or menu. Once your order ships, you'll receive tracking information to monitor your delivery."
        },
        {
          question: "Do you ship worldwide?",
          answer: "Yes! We offer worldwide shipping to all countries, and the best part is - shipping is always FREE! Each order is carefully packaged to ensure safe international delivery."
        },
        {
          question: "What shipping protection do you offer?",
          answer: "We provide shipping guarantee policy and buyer protection on all orders. This ensures your purchase is protected from the moment you order until it arrives at your door. For detailed information, visit our shipping policy page: https://www.simpleinteriorideas.com/pages/shipping"
        },
        {
          question: "What if my order is delayed?",
          answer: "While we strive to meet our delivery timeline of 30 days plus processing, occasional delays may occur. We actively monitor all shipments and will contact you if any significant delays arise. You can always check your order status through our tracking system."
        },
        {
          question: "How are items packaged for shipping?",
          answer: "We use eco-friendly packaging materials to protect your items during transit. Fragile items like ceramic vases and marble accessories receive extra padding. All packaging aligns with our commitment to environmental responsibility."
        },
        {
          question: "Will I receive shipping updates?",
          answer: "Yes! You'll receive email notifications at key stages: order confirmation, processing completion, shipping confirmation with tracking information, and delivery confirmation."
        },
        {
          question: "What if I'm not home for delivery?",
          answer: "Delivery procedures vary by country and carrier. Generally, carriers will leave a notice and attempt redelivery or hold the package at a local pickup point. Tracking information will provide specific delivery attempt details."
        },
        {
          question: "Can I specify delivery instructions?",
          answer: "Yes! During checkout, you can add delivery notes or special instructions. Please provide any relevant details about access codes, preferred delivery times, or specific locations for package placement."
        }
      ]
    },
    products: {
      title: "Products & Collections",
      items: [
        {
          question: "What types of products do you offer?",
          answer: "We specialize in natural, eco-friendly home decor including: Decorative Lanterns, Candles & Candlesticks, Canvas Paintings & Prints, Carpets & Jute Rugs, Ceramic Vases, Marble Accessories, Wooden Furniture, Gifts, Kitchen Accessories, Lamps & Handmade Lights, Linen Sets & Boho Textiles, Linen Curtains, Natural & Dried Flowers, Rattan Accessories, and Wall Decorations."
        },
        {
          question: "What makes your products unique?",
          answer: "Our products focus on four key aspects: Natural and eco-friendly materials, handcrafted quality, comfort, and cozy living. We blend Japandi and Scandinavian styles, emphasizing artisanal craftsmanship and natural materials in neutral, earthy tones."
        },
        {
          question: "Do you offer customization options?",
          answer: "We're excited to announce our upcoming 'Craft Your Gift' service, which will offer customization options. Stay tuned for more details about this new feature!"
        },
        {
          question: "What materials do you use in your products?",
          answer: "We prioritize natural and eco-friendly materials including wood, bamboo, linen, wool, cotton, rattan, and other sustainable materials. Our furniture often features minimalist metal details, while textiles are chosen for their natural quality and comforting textures."
        },
        {
          question: "How do you ensure product quality?",
          answer: "Each item is carefully selected to meet our standards for handcrafted quality and sustainable materials. We work with artisans who specialize in creating pieces that blend functionality with natural beauty."
        },
        {
          question: "Are your canvas prints original artwork?",
          answer: "Yes! Our canvas paintings and prints feature original designs that complement our natural, eco-friendly aesthetic. Each piece is carefully selected to enhance the Japandi and Scandinavian style we embrace."
        },
        {
          question: "What sizes are available for linen curtains?",
          answer: "Our linen curtains come in standard sizes suitable for most windows. Each product listing includes detailed measurements. For specific size questions, please contact our support team."
        },
        {
          question: "How long do your dried flowers last?",
          answer: "With proper care, our natural and dried flowers can last for many months to years. Keep them away from direct sunlight and moisture to maintain their beauty. Each arrangement is carefully preserved to ensure longevity."
        },
        {
          question: "Are your rattan accessories suitable for outdoor use?",
          answer: "Our rattan accessories are designed for indoor use only. To maintain their quality and longevity, we recommend keeping them in covered, indoor spaces away from direct sunlight and moisture."
        },
        {
          question: "What types of wooden furniture do you offer?",
          answer: "Our wooden furniture collection includes coffee tables, side tables, and decorative pieces, all crafted from sustainable wood sources. Each piece features our signature minimalist design with natural finishes."
        },
        {
          question: "Tell me about your kitchen accessories.",
          answer: "Our kitchen accessories blend functionality with natural beauty, featuring items made from sustainable materials like wood, ceramic, and marble. Each piece is selected to enhance both the aesthetic and practical aspects of your kitchen."
        },
        {
          question: "What styles of lamps and lighting do you offer?",
          answer: "Our lighting collection includes handmade lamps featuring natural materials like wood, rattan, and fabric shades. Each piece is designed to create warm, inviting atmospheres while maintaining our commitment to eco-friendly materials."
        }
      ]
    },
    returns: {
      title: "Returns & Refunds",
      items: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day money-back guarantee on all purchases. Our return policy includes buyer protection to ensure your satisfaction. For detailed information, visit: https://www.simpleinteriorideas.com/pages/return-policy"
        },
        {
          question: "How do I initiate a return?",
          answer: "To start a return, use our Refunds form in the website header or contact our support team at info@simpleinteriorideas.com. We'll guide you through the return process and provide necessary instructions."
        },
        {
          question: "What is your buyer protection policy?",
          answer: "We offer comprehensive buyer protection through both our store policies and PayPal. This includes protection against damaged items, incorrect deliveries, and ensures secure transactions."
        },
        {
          question: "How long do refunds take?",
          answer: "Once we receive your return, refunds are processed through the original payment method (PayPal). Processing times may vary depending on your payment provider, but typically complete within 5-7 business days."
        },
        {
          question: "Do you offer exchanges?",
          answer: "Yes, we offer exchanges within our 30-day return period. Contact our support team through the Refunds form or email to arrange an exchange."
        },
        {
          question: "What if I receive a damaged item?",
          answer: "If you receive a damaged item, please take photos and contact us immediately through our support form or email. We'll arrange for a replacement or refund under our buyer protection policy."
        },
        {
          question: "Do I need the original packaging to return?",
          answer: "While original packaging is preferred, we understand it's not always possible to keep it. Ensure items are securely packaged for safe return shipping. Contact us for specific packaging guidelines for fragile items."
        },
        {
          question: "Who pays for return shipping?",
          answer: "For items damaged upon arrival or incorrect shipments, we cover return shipping costs. For other returns within our 30-day guarantee period, customer is responsible for return shipping."
        },
        {
          question: "Can I return multiple items from one order?",
          answer: "Yes, you can return multiple items from the same order. Each item must meet our return policy requirements. Contact our support team for specific instructions on multiple-item returns."
        },
        {
          question: "What items cannot be returned?",
          answer: "For hygiene reasons, used candles cannot be returned. Custom-made items from our upcoming 'Craft Your Gift' service will have specific return policies. All other items are eligible for return within 30 days."
        }
      ]
    },
    care: {
      title: "Product Care & Maintenance",
      items: [
        {
          question: "How should I care for wooden furniture?",
          answer: "Clean with a soft, slightly damp cloth and dry immediately. Avoid direct sunlight and keep away from heat sources. For natural wood pieces, occasional treatment with appropriate wood oil helps maintain their beauty."
        },
        {
          question: "How do I care for linen textiles?",
          answer: "Our linen products can be machine washed on gentle cycle with mild detergent. Wash similar colors together. Air dry when possible to maintain the natural texture of the linen. Iron on medium heat if needed."
        },
        {
          question: "How should I maintain rattan accessories?",
          answer: "Dust regularly with a soft brush or cloth. Clean with a slightly damp cloth when needed. Keep rattan items away from direct sunlight and excessive moisture to prevent fading and maintain their natural beauty."
        },
        {
          question: "How do I care for natural & dried flowers?",
          answer: "Keep dried flowers away from direct sunlight and moisture. Dust gently with a soft brush or use low-pressure compressed air. Avoid water cleaning as it can damage the preserved flowers."
        },
        {
          question: "How should I clean ceramic and marble items?",
          answer: "Clean ceramic items with mild soap and water, dry thoroughly. For marble accessories, use a soft cloth and specific marble cleaner. Avoid acidic cleaners and seal marble pieces periodically to protect their finish."
        },
        {
          question: "How do I maintain canvas paintings?",
          answer: "Dust canvas prints gently with a soft, dry cloth. Avoid direct sunlight to prevent fading. Don't use water or cleaning products on the canvas. Keep away from high humidity areas."
        },
        {
          question: "What's the best way to clean jute rugs?",
          answer: "Vacuum regularly using low suction. For spots, blot immediately with clean cloth. Avoid excessive water. Professional cleaning recommended for deep cleaning. Rotate periodically for even wear."
        },
        {
          question: "How do I care for decorative lanterns?",
          answer: "Clean glass parts with glass cleaner and soft cloth. Wipe metal components with dry cloth. For wooden elements, follow wood care instructions. Keep away from excessive moisture."
        },
        {
          question: "How should I maintain linen curtains?",
          answer: "Machine wash in cold water on gentle cycle. Use mild detergent. Hang to dry or tumble dry on low. Iron on medium heat while slightly damp if needed. Avoid bleach and harsh detergents."
        },
        {
          question: "How do I care for handmade lights?",
          answer: "Dust regularly with soft cloth. Clean shades gently according to material type. Always ensure lights are off and cool before cleaning. Keep electrical components dry."
        }
      ]
    }
  };
  

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = activeCategory === 'all'
    ? Object.values(faqData).flatMap(category => category.items)
    : faqData[activeCategory as keyof typeof faqData]?.items || [];

  const searchedFaqs = searchQuery
    ? filteredFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredFaqs;

  return (
    <>
      <NavigationHeader />
      
      <main className="min-h-screen bg-[#FAF9F6]">
        <div className="w-full bg-[#EDE8E3] py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#6B5E4C] text-center">
              Frequently Asked Questions
            </h1>
          </div>
        </div>

        {/* Sticky Container */}
        <div className="sticky top-0 bg-[#EDE8E3] py-6 shadow-sm z-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="What can we help you find?"
                className="w-full px-4 py-3 rounded-lg border border-[#B5A48B]/20 
                         focus:outline-none focus:border-[#6B5E4C] 
                         bg-white/50 text-[#6B5E4C]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                    activeCategory === category.id
                      ? "bg-[#6B5E4C] text-white"
                      : "bg-[#EDE8E3] text-[#6B5E4C] hover:bg-[#6B5E4C]/10"
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto">
            {activeCategory !== 'all' && (
              <div className="sticky top-[132px] bg-[#FAF9F6] py-4 z-40">
                <h2 className="text-2xl font-semibold text-[#6B5E4C]">
                  {faqData[activeCategory as keyof typeof faqData]?.title}
                </h2>
              </div>
            )}
            <Accordion type="single" collapsible className="space-y-4">
              {searchedFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-[#B5A48B]/20 rounded-lg bg-white"
                >
                  <AccordionTrigger className="px-6 py-4 text-[#6B5E4C] hover:text-[#6B5E4C]/80 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-[#8C7E6A]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
} 