const WhatsAppBtn = ({ phone, title = "product" }) => {
  const cleaned = (phone || import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/[^\d+]/g, "");
  const msg = encodeURIComponent(`Namaste, I am interested in ${title} on GramBazaar.`);
  return (
    <a
      href={`https://wa.me/${cleaned}?text=${msg}`}
      target="_blank"
      rel="noreferrer"
      className="tap-target flex-1 bg-green-500 text-white rounded-lg px-3 py-2 text-center"
    >
      WhatsApp
    </a>
  );
};

export default WhatsAppBtn;
