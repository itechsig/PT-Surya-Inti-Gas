import { ContactForm } from "./ContactForm";
import { motion } from "motion/react";

export const ContactPage = () => {

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold text-slate-900 mb-4"
            style={{ fontFamily: "Barlow, sans-serif", fontWeight: 800 }}
          >
            Hubungi Kami
          </h1>
          <p className="text-slate-600 text-lg mx-auto max-w-2xl">
            Kami siap membantu Anda. Silakan isi formulir di bawah ini.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ContactForm di kiri */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ContactForm />
          </motion.div>

          {/* Maps di kanan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Map Sidoarjo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span
                  className="text-sm font-bold text-slate-800"
                  style={{ fontFamily: "Barlow, sans-serif" }}
                >
                  Kantor Pusat - Sidoarjo
                </span>
              </div>
              <div className="h-64">
                <iframe
                  title="Kantor Pusat - Sidoarjo"
                  src="https://www.google.com/maps?q=PT+Surya+Inti+Gas+Sidoarjo&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>

            {/* Map Balikpapan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                <span
                  className="text-sm font-bold text-slate-800"
                  style={{ fontFamily: "Barlow, sans-serif" }}
                >
                  Kantor Cabang - Balikpapan
                </span>
              </div>
              <div className="h-64">
                <iframe
                  title="Kantor Cabang - Balikpapan"
                  src="https://www.google.com/maps?q=PT+Surya+Inti+Gas+Balikpapan&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
