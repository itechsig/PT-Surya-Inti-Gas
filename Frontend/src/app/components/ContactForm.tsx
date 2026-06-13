import React, { useState, useEffect } from "react";
import { Mail, Phone, User, MessageSquare, Send, Loader } from "lucide-react";
import { motion } from "motion/react";
import { CSRFProtection } from "../../utils/csrf";
import { InputSanitizer } from "../../utils/sanitization";
import { getApiUrl, API_ENDPOINTS } from "../../config/api";

interface ContactFormProps {
  // No props needed for static form
}

interface FormData {
  nama: string;
  email: string;
  no_hp: string;
  pesan: string;
}

export const ContactForm = ({}: ContactFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    email: "",
    no_hp: "",
    pesan: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string>("");

  useEffect(() => {
    setCsrfToken(CSRFProtection.getToken());
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama harus diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.no_hp.trim()) {
      newErrors.no_hp = "No HP harus diisi";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.no_hp)) {
      newErrors.no_hp = "Format No HP tidak valid";
    }

    if (!formData.pesan.trim()) {
      newErrors.pesan = "Pesan harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = InputSanitizer.sanitizeFormData({ [name]: value })[name];
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Sanitize all form data before submission
    const sanitizedData = InputSanitizer.sanitizeFormData(formData);

    setIsLoading(true);
    
    try {
      const headers = CSRFProtection.addToHeaders({
        'Content-Type': 'application/json',
      });

      const response = await fetch(getApiUrl(API_ENDPOINTS.CONTACT), {
        method: 'POST',
        headers,
        body: JSON.stringify(sanitizedData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        CSRFProtection.refreshToken(); // Refresh token after successful submission
        // Reset form after 2 seconds
        setTimeout(() => {
          setFormData({ nama: "", email: "", no_hp: "", pesan: "" });
          setIsSubmitted(false);
        }, 2000);
      } else {
        CSRFProtection.refreshToken(); // Refresh token after failed submission
        throw new Error('Gagal mengirim pesan');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // You could show an error message here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Hubungi Kami</h3>
            <p className="text-sm text-blue-100">Kirim pesan kepada kami</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Pesan Terkirim!</h4>
            <p className="text-gray-600">Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* CSRF Token */}
            <input
              type="hidden"
              name="csrf_token"
              value={csrfToken}
            />
            {/* Nama */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4" />
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.nama ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama lengkap Anda"
                disabled={isLoading}
              />
              {errors.nama && (
                <p className="text-xs text-red-500 mt-1">{errors.nama}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="nama@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* No HP */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4" />
                No WhatsApp
              </label>
              <input
                type="tel"
                name="no_hp"
                value={formData.no_hp}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.no_hp ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="08xxxxxxxxxx"
                disabled={isLoading}
              />
              {errors.no_hp && (
                <p className="text-xs text-red-500 mt-1">{errors.no_hp}</p>
              )}
            </div>

            {/* Pesan */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <MessageSquare className="w-4 h-4" />
                Pesan
              </label>
              <textarea
                name="pesan"
                value={formData.pesan}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.pesan ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tulis pesan Anda di sini..."
                rows={4}
                disabled={isLoading}
              />
              {errors.pesan && (
                <p className="text-xs text-red-500 mt-1">{errors.pesan}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
