import jsPDF from 'jspdf';

export const generateInvoicePDF = (bookingData) => {
  const doc = new jsPDF();
  
  // Branding Header
  doc.setFontSize(24);
  doc.setTextColor(212, 175, 55); // #D4AF37 Gold
  doc.text("LuxuryStay Hotels", 20, 25);
  
  doc.setFontSize(12);
  doc.setTextColor(150, 150, 150);
  doc.text("OFFICIAL INVOICE", 155, 25);
  
  // Details Box
  doc.setDrawColor(212, 175, 55);
  doc.line(20, 35, 190, 35);

  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text(`Booking Reference ID: ${bookingData.id}`, 20, 47);
  doc.text(`Guest Profile Name: ${bookingData.guestName}`, 20, 54);
  doc.text(`Assigned Core Unit: ${bookingData.room}`, 20, 61);
  doc.text(`Scheduled Timeline: ${bookingData.dates}`, 20, 68);
  
  // Table Render Header
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(250, 250, 250);
  doc.rect(20, 80, 170, 10, 'F');
  
  doc.setFont(undefined, 'bold');
  doc.text("SERVICE DESCRIPTION", 25, 87);
  doc.text("RAW AMOUNT", 155, 87);
  
  doc.setFont(undefined, 'normal');
  let y = 105;
  
  doc.text(`Operations Charge (${bookingData.nights || 3} unit nights)`, 25, y);
  doc.text(`$${bookingData.roomTotal.toFixed(2)}`, 155, y);
  
  y += 12;
  doc.text("Concierge Services (Dining & Amenities)", 25, y);
  doc.text(`$${bookingData.servicesTotal.toFixed(2)}`, 155, y);
  
  // Calculate Totals Mapping
  const subtotal = bookingData.roomTotal + bookingData.servicesTotal;
  const gst = subtotal * 0.13; // 13% Universal GST Configured
  const grandTotal = subtotal + gst;
  
  y += 20;
  doc.setDrawColor(220, 220, 220);
  doc.line(100, y - 5, 190, y - 5);
  
  doc.text("Operations Subtotal:", 100, y);
  doc.text(`$${subtotal.toFixed(2)}`, 155, y);
  
  y += 10;
  doc.setTextColor(150, 150, 150);
  doc.text("GST Taxation Scope (13%):", 100, y);
  doc.text(`$${gst.toFixed(2)}`, 155, y);
  
  y += 15;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text("FINAL GRAND TOTAL:", 100, y);
  doc.setTextColor(21, 128, 61); // Tailwind green-700
  doc.text(`$${grandTotal.toFixed(2)}`, 155, y);
  
  // Footer
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for elevating your experience alongside LuxuryStay.", 20, 280);
  
  // Save Document
  doc.save(`LuxuryStay_Invoice_${bookingData.id}.pdf`);
};
