import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import path from "path";
import fs from "fs";

export async function generateInvoice(order: any) {
    const hidePrices = Boolean(order.removeInvoice);

    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([595, 842]);

    // =========================
    // FONTS
    // =========================

    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const serif = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const serifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // =========================
    // COLORS
    // =========================

    const INK = rgb(0.11, 0.10, 0.09);
    const TEXT = rgb(0.29, 0.27, 0.24);
    const MUTED = rgb(0.54, 0.52, 0.48);
    const GOLD = rgb(0.61, 0.51, 0.31);

    const BORDER = rgb(0.85, 0.83, 0.79);
    const LIGHT_BORDER = rgb(0.88, 0.86, 0.82);
    const PAPER = rgb(0.98, 0.97, 0.94);
    const SOFT = rgb(0.95, 0.94, 0.90);
    const WHITE = rgb(1, 1, 1);

    // =========================
    // BACKGROUND
    // =========================

    page.drawRectangle({
        x: 0,
        y: 0,
        width: 595,
        height: 842,
        color: PAPER,
    });

    // =========================
    // HELPERS
    // =========================

    const sanitize = (value: unknown) =>
        String(value ?? "")
            .replace(/[^\x20-\x7E]/g, "")
            .trim();

    const text = (
        value: unknown,
        x: number,
        y: number,
        size = 10,
        font = regular,
        color = TEXT
    ) => {
        page.drawText(sanitize(value), {
            x,
            y,
            size,
            font,
            color,
        });
    };

    const centeredText = (
        value: unknown,
        y: number,
        size = 10,
        font = regular,
        color = TEXT
    ) => {
        const valueString = sanitize(value);
        const width = font.widthOfTextAtSize(valueString, size);

        text(
            valueString,
            (595 - width) / 2,
            y,
            size,
            font,
            color
        );
    };

    const line = (
        y: number,
        x1 = 45,
        x2 = 550,
        color = LIGHT_BORDER,
        thickness = 0.7
    ) => {
        page.drawLine({
            start: { x: x1, y },
            end: { x: x2, y },
            thickness,
            color,
        });
    };

    const drawLabel = (
        value: string,
        x: number,
        y: number
    ) => {
        text(
            value,
            x,
            y,
            7,
            bold,
            GOLD
        );
    };

    // =========================
    // OUTER BORDER
    // =========================

    page.drawRectangle({
        x: 28,
        y: 28,
        width: 539,
        height: 786,
        borderColor: BORDER,
        borderWidth: 0.8,
    });

    // =========================
    // LOGO
    // =========================

    const logoPath = path.join(
        process.cwd(),
        "public",
        "images",
        "logo.png"
    );

    if (fs.existsSync(logoPath)) {
        const logoBytes = fs.readFileSync(logoPath);
        const logo = await pdfDoc.embedPng(logoBytes);

        const maxWidth = 105;
        const maxHeight = 55;

        const scale = Math.min(
            maxWidth / logo.width,
            maxHeight / logo.height
        );

        const logoWidth = logo.width * scale;
        const logoHeight = logo.height * scale;

        page.drawImage(logo, {
            x: (595 - logoWidth) / 2,
            y: 755,
            width: logoWidth,
            height: logoHeight,
        });
    }

    // =========================
    // BRAND
    // =========================

    centeredText(
        "LUXE MEN",
        718,
        18,
        serifBold,
        INK
    );

    // Decorative brand line

    const brandLineWidth = 38;

    page.drawLine({
        start: {
            x: 297.5 - 70,
            y: 705,
        },
        end: {
            x: 297.5 - 70 + brandLineWidth,
            y: 705,
        },
        thickness: 0.7,
        color: BORDER,
    });

    page.drawLine({
        start: {
            x: 297.5 + 70 - brandLineWidth,
            y: 705,
        },
        end: {
            x: 297.5 + 70,
            y: 705,
        },
        thickness: 0.7,
        color: BORDER,
    });

    centeredText(
        "INVOICE",
        701,
        7,
        bold,
        GOLD
    );

    centeredText(
        "www.luxemen.com",
        685,
        8,
        regular,
        MUTED
    );

    line(666, 45, 550, BORDER);

    // =========================
    // INVOICE META
    // =========================

    drawLabel(
        "INVOICE NUMBER",
        45,
        642
    );

    text(
        order.orderNumber,
        45,
        625,
        10,
        bold,
        INK
    );

    drawLabel(
        "DATE",
        430,
        642
    );

    text(
        new Date(order.createdAt).toLocaleDateString(),
        430,
        625,
        10,
        regular,
        TEXT
    );

    // =========================
    // BILL TO
    // =========================

    line(605, 45, 550, LIGHT_BORDER);

    drawLabel(
        "BILL TO",
        45,
        583
    );

    let customerY = 563;

    const customerDetails = [
        order.address?.fullname,
        `${order.address?.countryCode ?? ""} ${order.address?.phone ?? ""}`.trim(),
        order.address?.addressLine,
        `${order.address?.city ?? ""}, ${order.address?.state ?? ""}`.replace(/^,\s*|,\s*$/g, ""),
        order.address?.postalCode,
        order.address?.country,
    ];

    customerDetails.forEach((item, index) => {
        if (!item) return;

        text(
            item,
            45,
            customerY,
            index === 0 ? 10 : 8.5,
            index === 0 ? bold : regular,
            index === 0 ? INK : TEXT
        );

        customerY -= index === 0 ? 18 : 14;
    });

    // =========================
    // ORDER DETAILS
    // =========================

    drawLabel(
        "ORDER DETAILS",
        380,
        583
    );

    text(
        `Payment: ${sanitize(order.paymentMethod)}`,
        380,
        563,
        8.5,
        regular,
        TEXT
    );

    text(
        `Status: ${sanitize(order.paymentStatus)}`,
        380,
        547,
        8.5,
        regular,
        TEXT
    );

    if (order.packagingOption) {
        text(
            `Packaging: ${sanitize(order.packagingOption)}`,
            380,
            531,
            8.5,
            regular,
            TEXT
        );
    }

    // =========================
    // ITEMS
    // =========================

    const itemsHeaderY = 490;

    page.drawRectangle({
        x: 45,
        y: itemsHeaderY - 4,
        width: 505,
        height: 25,
        color: SOFT,
    });

    text(
        "PRODUCT",
        57,
        itemsHeaderY + 5,
        7,
        bold,
        GOLD
    );

    text(
        "QTY",
        hidePrices ? 475 : 350,
        itemsHeaderY + 5,
        7,
        bold,
        GOLD
    );

    if (!hidePrices) {
        text(
            "PRICE",
            410,
            itemsHeaderY + 5,
            7,
            bold,
            GOLD
        );

        text(
            "TOTAL",
            490,
            itemsHeaderY + 5,
            7,
            bold,
            GOLD
        );
    }

    let itemY = itemsHeaderY - 28;

    for (const item of order.items ?? []) {
        if (itemY < 270) {
            break;
        }

        const title = sanitize(item.title);

        text(
            title,
            57,
            itemY,
            9,
            bold,
            INK
        );

        let rowHeight = 27;

        if (
            item.attributes &&
            typeof item.attributes === "object"
        ) {
            const attributes = Object.values(item.attributes)
                .map((value) => sanitize(value))
                .filter(Boolean)
                .join(" / ");

            if (attributes) {
                text(
                    attributes,
                    57,
                    itemY - 13,
                    7.5,
                    regular,
                    MUTED
                );

                rowHeight = 34;
            }
        }

        text(
            item.quantity,
            hidePrices ? 477 : 355,
            itemY,
            8.5,
            regular,
            TEXT
        );

        if (!hidePrices) {
            text(
                `$${Number(item.price).toFixed(2)}`,
                410,
                itemY,
                8.5,
                regular,
                TEXT
            );

            text(
                `$${Number(item.total).toFixed(2)}`,
                490,
                itemY,
                8.5,
                bold,
                INK
            );
        }

        itemY -= rowHeight;

        line(
            itemY + 8,
            45,
            550,
            LIGHT_BORDER,
            0.5
        );
    }

    // =========================
    // SUMMARY
    // =========================

    let summaryY = itemY - 18;

    if (!hidePrices) {
        const summaryHeight = 92;

        page.drawRectangle({
            x: 330,
            y: summaryY - summaryHeight + 8,
            width: 220,
            height: summaryHeight,
            borderColor: BORDER,
            borderWidth: 0.7,
            color: rgb(0.985, 0.98, 0.96),
        });

        drawLabel(
            "ORDER SUMMARY",
            348,
            summaryY - 10
        );

        text(
            "Subtotal",
            348,
            summaryY - 32,
            8.5,
            regular,
            TEXT
        );

        text(
            `$${Number(order.subtotal).toFixed(2)}`,
            482,
            summaryY - 32,
            8.5,
            regular,
            TEXT
        );

        text(
            "Shipping",
            348,
            summaryY - 50,
            8.5,
            regular,
            TEXT
        );

        text(
            `$${Number(order.shipping).toFixed(2)}`,
            482,
            summaryY - 50,
            8.5,
            regular,
            TEXT
        );

        page.drawLine({
            start: {
                x: 348,
                y: summaryY - 61,
            },
            end: {
                x: 532,
                y: summaryY - 61,
            },
            thickness: 0.5,
            color: BORDER,
        });

        text(
            "TOTAL",
            348,
            summaryY - 78,
            8,
            bold,
            GOLD
        );

        text(
            `$${Number(order.total).toFixed(2)}`,
            475,
            summaryY - 78,
            10,
            bold,
            INK
        );
    } else {
        drawLabel(
            "INVOICE",
            348,
            summaryY - 10
        );

        text(
            "Prices have been removed from this invoice.",
            348,
            summaryY - 30,
            8,
            regular,
            MUTED
        );

        text(
            "Prepared for gifting.",
            348,
            summaryY - 47,
            8,
            regular,
            MUTED
        );
    }

    // =========================
    // GIFT MESSAGE
    // =========================

    let detailsY = Math.min(summaryY - 120, 190);

    if (order.giftMessage) {
        line(
            detailsY + 20,
            45,
            550
        );

        drawLabel(
            "GIFT MESSAGE",
            45,
            detailsY
        );

        text(
            order.giftMessage,
            45,
            detailsY - 20,
            8.5,
            regular,
            TEXT
        );

        detailsY -= 50;
    }

    // =========================
    // FOOTER
    // =========================

    line(
        104,
        45,
        550,
        BORDER
    );

    centeredText(
        "THANK YOU FOR CHOOSING LUXE MEN",
        78,
        10,
        serif,
        INK
    );

    centeredText(
        "Premium fashion · Timeless style",
        58,
        7,
        regular,
        MUTED
    );

    centeredText(
        "LUXE MEN · PREMIUM MENSWEAR",
        42,
        6,
        bold,
        GOLD
    );

    return await pdfDoc.save();
}
