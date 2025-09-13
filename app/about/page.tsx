import { Metadata } from 'next'
import Section from '@/components/Section'
import AnimatedCard from '@/components/AnimatedCard'

export const metadata: Metadata = {
  title: 'درباره ما - گاراژ تخصصی مکانیکی',
  description: 'با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی، تیم متخصص ما بهترین خدمات را ارائه می‌دهد.',
  keywords: 'درباره ما، تیم مکانیک، تجربه، گاراژ تخصصی',
}

export default function AboutPage() {
  return (
    <div className="bg-dark-950 min-h-screen">
      {/* Hero Section */}
      <Section 
        title="درباره ما"
        subtitle="با بیش از 15 سال تجربه در تعمیر خودروهای آلمانی و چینی"
        background="gradient"
        padding="xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-3xl font-bold text-gradient-gold">
              داستان ما
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              گاراژ تخصصی مکانیکی تورنادو در سال 1388 با هدف ارائه خدمات تعمیر خودروهای آلمانی و چینی تأسیس شد. 
              ما با تکیه بر تجربه و دانش فنی تیم متخصص خود، همواره در تلاش برای ارائه بهترین خدمات به مشتریان عزیزمان هستیم.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              امروزه با بیش از 15 سال تجربه و استفاده از جدیدترین تجهیزات و تکنولوژی‌های روز دنیا، 
              آماده خدمت‌رسانی به شما عزیزان هستیم.
            </p>
          </div>
          
          <div className="relative animate-slide-up">
            <div className="w-full h-96 bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🔧</div>
                <p className="text-gray-300">تصویر گاراژ</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Values Section */}
      <Section 
        title="ارزش‌های ما"
        subtitle="اصول و ارزش‌هایی که در کار ما راهنما هستند"
        background="pattern"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatedCard variant="glass" delay={0} className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">کیفیت</h3>
            <p className="text-gray-300">
              ارائه خدمات با بالاترین کیفیت و استفاده از بهترین قطعات و تجهیزات
            </p>
          </AnimatedCard>

          <AnimatedCard variant="glass" delay={100} className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⏰</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">سرعت</h3>
            <p className="text-gray-300">
              انجام کارها در کمترین زمان ممکن بدون قربانی کردن کیفیت
            </p>
          </AnimatedCard>

          <AnimatedCard variant="glass" delay={200} className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">اعتماد</h3>
            <p className="text-gray-300">
              ایجاد رابطه‌ای صادقانه و قابل اعتماد با مشتریان عزیزمان
            </p>
          </AnimatedCard>
        </div>
      </Section>

      {/* Team Section */}
      <Section 
        title="تیم ما"
        subtitle="متخصصان با تجربه و ماهر ما"
        background="default"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatedCard variant="glass" delay={0} className="p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👨‍🔧</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">مهندس احمد محمدی</h3>
            <p className="text-primary-400 mb-3">مدیر فنی</p>
            <p className="text-gray-300 text-sm">
              با 15 سال تجربه در تعمیر خودروهای آلمانی
            </p>
          </AnimatedCard>

          <AnimatedCard variant="glass" delay={100} className="p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👨‍🔧</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">مهندس علی رضایی</h3>
            <p className="text-primary-400 mb-3">متخصص گیربکس</p>
            <p className="text-gray-300 text-sm">
              متخصص در تعمیر گیربکس‌های اتوماتیک و دستی
            </p>
          </AnimatedCard>

          <AnimatedCard variant="glass" delay={200} className="p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500/20 to-primary-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👨‍🔧</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">مهندس حسن کریمی</h3>
            <p className="text-primary-400 mb-3">متخصص برق</p>
            <p className="text-gray-300 text-sm">
              متخصص در سیستم‌های برقی و الکترونیکی خودرو
            </p>
          </AnimatedCard>
        </div>
      </Section>
    </div>
  )
}
