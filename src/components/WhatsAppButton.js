import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phoneNumber = "905442030662";
  const message = "Merhaba, ürünler hakkında bilgi almak istiyorum.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-green-500 text-white shadow-2xl transition hover:scale-110 hover:bg-green-600"
      aria-label="WhatsApp ile iletişime geç"
    >
      <FaWhatsapp size={34} />
    </a>
  );
}
