import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { TicketData } from '../components/BookingsScreen';

export async function generatePdfInvoice(
  ticket: TicketData,
  userName: string = 'Ajay Kumar Reddy k',
  userPhone: string = '6303945563'
) {
  // Create a hidden container div formatted to exact A4 proportions (794px x 1123px at 96DPI)
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '794px';
  container.style.height = '1123px';
  container.style.backgroundColor = '#FFFFFF';
  container.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  container.style.boxSizing = 'border-box';
  container.style.padding = '28px';

  // SVG Watermark background string matching reference PDF watermarks
  const watermarkSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
      <g transform="rotate(-25 150 100)" fill="none" stroke="#0066FF" opacity="0.065">
        <text x="20" y="80" font-family="sans-serif" font-size="28" font-weight="bold" fill="#0066FF">RailOne</text>
        <path d="M140 50 Q160 30 190 35 L220 50 Q230 65 210 75 L150 75 Z" stroke-width="2"/>
        <text x="160" y="160" font-family="sans-serif" font-size="28" font-weight="bold" fill="#0066FF">RailOne</text>
      </g>
    </svg>
  `;
  const watermarkBase64 = `data:image/svg+xml;base64,${btoa(watermarkSvg)}`;

  const cleanFare = ticket.fare ? (ticket.fare.startsWith('₹') ? ticket.fare : `₹${ticket.fare}`) : '₹5.00';

  container.innerHTML = `
    <div style="
      width: 100%;
      height: 100%;
      border: 1px solid #CBD5E1;
      border-radius: 24px;
      padding: 36px 42px;
      box-sizing: border-box;
      position: relative;
      background-color: #FFFFFF;
      background-image: url('${watermarkBase64}');
      background-repeat: repeat;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    ">
      <div>
        <!-- Top Header Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 56px; height: 56px; border-radius: 16px; background-color: #0066FF; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
              <img src="/images/pdf_train_logo.png" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <h1 style="font-size: 32px; font-weight: 800; color: #0F172A; margin: 0; align-self: center; letter-spacing: -0.5px;">
              UTS Invoice
            </h1>
          </div>
          <div style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden;">
            <img src="/images/indian_railways_logo.png" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        </div>

        <!-- Solid Header Separator Line -->
        <div style="width: 100%; height: 2px; background-color: #1E293B; margin-bottom: 28px;"></div>

        <!-- Customer Details Section -->
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 16px 0;">Customer Details</h2>
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="font-size: 13px; font-weight: 600; color: #64748B; margin-bottom: 4px;">Passenger Name</div>
              <div style="font-size: 16px; font-weight: 800; color: #0F172A;">${userName || 'Ajay Kumar Reddy k'}</div>
            </div>

            <div style="text-align: right;">
              <div style="font-size: 13px; font-weight: 600; color: #64748B; margin-bottom: 4px;">Mobile Number</div>
              <div style="font-size: 16px; font-weight: 800; color: #0F172A;">${userPhone || '6303945563'}</div>
            </div>
          </div>
        </div>

        <!-- Light Section Separator Line -->
        <div style="width: 100%; height: 1px; background-color: #E2E8F0; margin-bottom: 28px;"></div>

        <!-- Journey Ticket Section -->
        <div style="margin-bottom: 28px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0;">Journey Ticket</h2>
            <div style="font-size: 18px; font-weight: 800; color: #0F172A; letter-spacing: 0.5px;">${ticket.code}</div>
          </div>

          <!-- Station to Station Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px;">
            <div style="font-size: 20px; font-weight: 800; color: #0F172A;">${ticket.fromStation}</div>
            
            <div style="
              border: 1px solid #CBD5E1; 
              background-color: #F8FAFC; 
              border-radius: 9999px; 
              padding: 6px 20px; 
              font-size: 14px; 
              font-weight: 600; 
              color: #475569;
            ">
              ${ticket.distanceOrTime || '15 km'}
            </div>

            <div style="font-size: 20px; font-weight: 800; color: #0F172A; text-align: right;">${ticket.toStation}</div>
          </div>

          <!-- Details Grid -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <div style="font-size: 13px; font-weight: 600; color: #64748B; margin-bottom: 4px;">Via</div>
              <div style="font-size: 15px; font-weight: 800; color: #0F172A;">---</div>
            </div>

            <div style="text-align: right;">
              <div style="font-size: 13px; font-weight: 600; color: #64748B; margin-bottom: 4px;">Passenger</div>
              <div style="font-size: 15px; font-weight: 800; color: #0F172A;">${ticket.passengers || '1 Adult, 0 Child'}</div>
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <div style="font-size: 13px; font-weight: 600; color: #64748B; margin-bottom: 4px;">Booked On</div>
            <div style="font-size: 15px; font-weight: 800; color: #0F172A;">${ticket.bookedTimestamp || '2026-05-28 11:05:36'}</div>
          </div>
        </div>

        <!-- Solid Separator Line -->
        <div style="width: 100%; height: 2px; background-color: #1E293B; margin-bottom: 32px;"></div>

        <!-- Class & Fare Rounded Pill Box -->
        <div style="
          background-color: #F1F5F9; 
          border-radius: 14px; 
          padding: 16px 24px; 
          margin-bottom: 32px;
          display: inline-block;
        ">
          <div style="font-size: 18px; font-weight: 800; color: #0F172A; letter-spacing: 0.5px;">
            ${ticket.classDetails || 'SECOND | ORDINARY | JOURNEY'} | ${cleanFare}
          </div>
        </div>

        <!-- Red Notice Line -->
        <div style="text-align: center; color: #EF4444; font-size: 16px; font-weight: 700; margin-top: 10px;">
          This invoice is for reference only and is not valid as a travel ticket.
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="margin-top: 40px;">
        <div style="width: 100%; height: 2px; background-color: #1E293B; margin-bottom: 16px;"></div>
        <div style="text-align: center; font-size: 14px; font-weight: 600; color: #475569;">
          This invoice is computer-generated. No signature is required.
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FFFFFF',
      logging: false
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    const filename = `${ticket.code}_journey_invoice.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF invoice:', error);
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
