import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import path from "path";
import fs from "fs";

export async function generateInvoice(order: any) {
    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([595, 842]);

    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const semiBold = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const BLACK = rgb(0.05, 0.05, 0.05);
    const GRAY = rgb(0.45, 0.45, 0.45);
    const LIGHT = rgb(0.93, 0.93, 0.93);

    const sanitize = (value: unknown) =>
        String(value ?? "")
            .replace(/[^\x20-\x7E]/g, "")
            .trim();


    // =========================
    // LOGO
    // =========================



    const logoPath = path.join(
        process.cwd(),
        "public",
        "images",
        "logo.png"
    );

    const logoBytes = fs.readFileSync(logoPath);

    const logo = await pdfDoc.embedPng(logoBytes);

    const maxWidth = 120;
    const maxHeight = 85;

    const scale = Math.min(
        maxWidth / logo.width,
        maxHeight / logo.height
    );

    const logoWidth = logo.width * scale;
    const logoHeight = logo.height * scale;

    page.drawImage(logo, {
        x: (595 - logoWidth) / 2,
        y: 735,
        width: logoWidth,
        height: logoHeight,
    });

    // =========================
    // TEXT HELPER
    // =========================

    const text = (
        value: unknown,
        x: number,
        y: number,
        size = 11,
        font = regular,
        color = BLACK
    ) => {
        page.drawText(sanitize(value), {
            x,
            y,
            size,
            font,
            color,
        });
    };


    const line = (y: number) => {
        page.drawLine({
            start: { x: 50, y },
            end: { x: 545, y },
            thickness: 0.8,
            color: LIGHT
        });
    };




    // =========================
    // BRAND
    // =========================

    const brand = "LUXE MEN";

    const brandSize = 22;

    const brandWidth = bold.widthOfTextAtSize(
        brand,
        brandSize
    );

    text(
        brand,
        (595 - brandWidth) / 2,
        705,
        brandSize,
        bold,
        BLACK
    );


    const website = "www.luxemen.com";

    const websiteSize = 10;

    const websiteWidth = regular.widthOfTextAtSize(
        website,
        websiteSize
    );

    text(
        website,
        (595 - websiteWidth) / 2,
        685,
        websiteSize,
        regular,
        GRAY
    );


    line(660);


    // =========================
    // INVOICE INFO 
    // =========================

    text(
        `Invoice No: ${order.orderNumber}`,
        380,
        625,
        10,
        semiBold
    );


    text(
        `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
        380,
        608,
        9,
        regular,
        GRAY
    );


    // =========================
    // CUSTOMER
    // =========================


    text(
        "BILL TO",
        50,
        625,
        10,
        bold,
        GRAY
    );


    let customerY = 603;


    [
        order.address.fullname,
        `${order.address.countryCode} ${order.address.phone}`,
        order.address.addressLine,
        `${order.address.city}, ${order.address.state}`,
        order.address.postalCode,
        order.address.country
    ].forEach(item => {
        text(item, 50, customerY, 11);
        customerY -= 16;
    });


    line(450);



    // =========================
    // ITEMS HEADER
    // =========================


    const itemsHeaderY = customerY - 35;


    page.drawRectangle({
        x: 50,
        y: itemsHeaderY,
        width: 495,
        height: 25,
        color: LIGHT
    });


    let itemY = itemsHeaderY - 30;


    text("PRODUCT", 60, itemsHeaderY + 9, 9, bold);

    text("QTY", 350, itemsHeaderY + 9, 9, bold);

    text("PRICE", 410, itemsHeaderY + 9, 9, bold);

    text("TOTAL", 485, itemsHeaderY + 9, 9, bold);


    order.items.forEach((item: any) => {

        if (itemY < 180) {
            return;
        }

        const title = sanitize(item.title);

        // Product title
        text(
            title,
            60,
            itemY,
            10,
            semiBold
        );


        // Attributes
        let rowHeight = 20;

        if (item.attributes) {
            text(
                Object.values(item.attributes).join(" / "),
                60,
                itemY - 14,
                8,
                regular,
                GRAY
            );

            rowHeight = 35;
        }


        // Keep values aligned to first line
        text(
            item.quantity,
            355,
            itemY,
            9
        );

        text(
            `$${Number(item.price).toFixed(2)}`,
            405,
            itemY,
            9
        );

        text(
            `$${Number(item.total).toFixed(2)}`,
            480,
            itemY,
            9
        );


        itemY -= rowHeight;

        line(itemY + 10);

    });



    // =========================
    // SUMMARY
    // =========================

    let summaryY = itemY - 50;

    if (summaryY < 260) {
        summaryY = 260;
    }


    page.drawRectangle({
        x: 330,
        y: summaryY - 65,
        width: 215,
        height: 80,
        borderColor: LIGHT,
        borderWidth: 1
    });


    const summaryLabelX = 350;
    const summaryAmountX = 480;


    text(
        "Subtotal",
        summaryLabelX,
        summaryY - 5,
        9,
        semiBold
    );

    text(
        `$${Number(order.subtotal).toFixed(2)}`,
        summaryAmountX,
        summaryY - 5,
        9,
        regular
    );


    text(
        "Shipping",
        summaryLabelX,
        summaryY - 25,
        9,
        semiBold
    );

    text(
        `$${Number(order.shipping).toFixed(2)}`,
        summaryAmountX,
        summaryY - 25,
        9,
        regular
    );


    text(
        "TOTAL",
        summaryLabelX,
        summaryY - 45,
        9,
        bold
    );

    text(
        `$${Number(order.total).toFixed(2)}`,
        summaryAmountX,
        summaryY - 45,
        10,
        bold
    );

    // =========================
    // PAYMENT DETAILS
    // =========================

    const paymentY = Math.max(summaryY - 150, 160);


    line(paymentY + 25);


    text(
        "PAYMENT DETAILS",
        50,
        paymentY,
        9,
        bold,
        GRAY
    );


    text(
        `Method: ${order.paymentMethod}`,
        50,
        paymentY - 20,
        9
    );


    text(
        `Status: ${order.paymentStatus}`,
        50,
        paymentY - 38,
        9
    );


    if (order.giftMessage) {
        text(
            `Gift Message: ${order.giftMessage}`,
            50,
            paymentY - 56,
            9
        );
    }



    // =========================
    // FOOTER
    // =========================

    line(100);


    const footerTitle = "Thank you for choosing LUXE MEN";

    const footerTitleWidth = bold.widthOfTextAtSize(
        footerTitle,
        12
    );

    text(
        footerTitle,
        (595 - footerTitleWidth) / 2,
        70,
        12,
        bold
    );


    const footerSub = "Premium fashion • Timeless style";

    const footerSubWidth = regular.widthOfTextAtSize(
        footerSub,
        9
    );

    text(
        footerSub,
        (595 - footerSubWidth) / 2,
        50,
        9,
        regular,
        GRAY
    );

    return await pdfDoc.save();
}