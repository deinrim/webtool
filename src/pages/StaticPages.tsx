import React, { useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Shield, Sparkles, Send, Mail, CheckCircle2, Lock, FileText, HelpCircle } from 'lucide-react';

export const AboutPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: 'About OmniTools' }]} onNavigate={onNavigate} />

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">About OmniTools</h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          OmniTools was founded on a simple principle: Everyday digital utilities should be completely free, lightning-fast, and respect user privacy without requiring bulky desktop software installations or intrusive trackers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border space-y-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <h3 className="text-sm font-bold">100% Client-Side Privacy</h3>
          <p className="text-xs text-slate-500">Image compression, PDF editing, and data transformations execute right in your browser memory.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border space-y-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <h3 className="text-sm font-bold">54+ Production Tools</h3>
          <p className="text-xs text-slate-500">A unified toolkit designed for marketers, developers, graphic designers, accountants, and students.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border space-y-2">
          <Lock className="w-6 h-6 text-emerald-500" />
          <h3 className="text-sm font-bold">No Account Required</h3>
          <p className="text-xs text-slate-500">Use any tool instantly without forced paywalls or mandatory email signups.</p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Tool Suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'Contact Support' }]} onNavigate={onNavigate} />

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Contact & Feedback</h1>
        <p className="text-sm text-slate-500 mt-1">Have a question, detected an issue, or want to suggest a new tool? Get in touch with our team.</p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">Message Received</h3>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">Thank you for contacting OmniTools! Our support engineers will respond within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Topic</label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border"
            >
              <option value="Tool Suggestion">Suggest a New Tool</option>
              <option value="Bug Report">Report a Bug / Glitch</option>
              <option value="Business API">Business API & Sponsorship</option>
              <option value="Other">General Feedback</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Your Message</label>
            <textarea
              rows={5}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Provide details..."
              className="w-full p-2.5 text-xs rounded-xl border"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" /> Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export const PrivacyPolicyPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} onNavigate={onNavigate} />
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
      <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4">
        <p>Last updated: March 2026</p>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">1. Client-Side Data Handling</h3>
        <p>OmniTools operates with an architecture prioritizing user privacy. For file manipulation tools including Image Compressor, PDF Merge, and Code Formatters, all file byte reading, processing, and encoding takes place locally inside your web browser sandbox using modern JavaScript and WebAssembly.</p>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">2. Analytics & Cookies</h3>
        <p>We use minimal session cookies to store your selected theme (dark or light mode) and local favorites. We do not sell your personal browsing habits or personal files to third-party data brokers.</p>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">3. GDPR & CCPA Rights</h3>
        <p>Users have full rights to request deletion of any registered account or clear their local storage cache at any time via the user dashboard.</p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'Terms of Service' }]} onNavigate={onNavigate} />
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms of Service</h1>
      <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4">
        <p>Welcome to OmniTools. By using our website and services, you agree to these Terms.</p>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">1. Acceptable Use</h3>
        <p>You agree not to use OmniTools to process illegal material, attempt automated scraping that degrades service availability, or bypass fair use limits.</p>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">2. Disclaimer of Warranties</h3>
        <p>All tools are provided "as is" without warranty of any kind. Calculations (such as ROAS, GPA, and tax estimations) are for informational and projection purposes only and should not replace professional financial or legal counsel.</p>
      </div>
    </div>
  );
};
