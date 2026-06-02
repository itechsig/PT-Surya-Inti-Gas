import React, { useState, useEffect } from "react";
import { X, Mail, Phone, User, MessageSquare, Send, Loader } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CSRFProtection } from "../../utils/csrf";
import { InputSanitizer } from "../../utils/sanitization";
import { getApiUrl, API_ENDPOINTS } from "../../config/api";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  nama: string;
  email: string;
  no_hp: string;
  pesan: string;
}

export const ContactForm = ({ isOpen, onClose }: ContactFormProps) => {
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
        // Reset form after 2 seconds and close modal
        setTimeout(() => {
          setFormData({ nama: "", email: "", no_hp: "", pesan: "" });
          setIsSubmitted(false);
          onClose();
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

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ nama: "", email: "", no_hp: "", pesan: "" });
      setErrors({});
      setIsSubmitted(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Hubungi Kami</h3>
                      <p className="text-sm text-blue-100">Kirim pesan kepada kami</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
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
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};